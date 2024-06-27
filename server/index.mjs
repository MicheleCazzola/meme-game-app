// imports
import express, { json } from 'express';
import { getMatchMemes, getUser, getUserMatchesHistory, registerMatch, getAllAssociatedCaptions } from "./src/controller.mjs";
import morgan from 'morgan';
import cors from "cors"
import passport from 'passport';
import LocalStrategy from 'passport-local'
import session from 'express-session';
import { body, param, validationResult } from 'express-validator';

// Init application
const baseURL = "/api"
const app = new express();
const port = 3001;
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};

// Middlewares
app.use(json());

app.use(morgan("dev"));

app.use(cors(corsOptions));

app.use(session({
    secret: "memegame20240627",
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

app.use(express.static("meme"));

// Local strategy to use user+password authentication
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password);
    if(!user) {
		return cb(null, false, 'Incorrect username or password.');
	}
      
    return cb(null, user);
}));
  
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});
  
// Validator for logged in user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}

// Validator for express-validator checks
const validateRequest = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: "Error in parameter formatting" });
	}
	return next();
}

// Login
app.post(`${baseURL}/sessions/`,
    body("username").trim().isLength({min: 1}),
    body("password").trim().isLength({min: 1}),
    validateRequest,
    function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
			return next(err);
		}
        if (!user) {
			// Authentication failed
            return res.status(401).send(info);
        }
        // Success, perform the login
        req.login(user, (err) => {
            if (err) {
				return next(err);
			}
            
			// User info is sent back
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

// Get user info
app.get(
	`${baseURL}/sessions/current`,
	isLoggedIn,
	(req, res) => res.json(req.user)
);

// Logout
app.delete(
	`${baseURL}/sessions/current`,
	isLoggedIn,
	(req, res) => req.logout(() => {
        res.end();
    })
);

// Get three memes for a match, with their captions
app.get(
    `${baseURL}/memes/match`,
	isLoggedIn,
    (req, res) => getMatchMemes(3)
        .then(result => {
            if (result.error) {
                res.status(404).json(result);
            }
            else {
                res.status(200).json(result);
            }
        })
        .catch(err => res.status(500).json(err))
);

// Get meme for a single round match, with its captions
app.get(
    `${baseURL}/memes/single`,
    (req, res) => getMatchMemes(1)
        .then(result => {
            if (result.error) {
                res.status(404).json(result);
            }
            else {
                res.status(200).json(result);
            }
        })
        .catch(err => res.status(500).json(err))
);

// Get all captions for a given meme
app.get(
    `${baseURL}/memes/:id/captions`,
    param("id").isInt({min: 1}),
    validateRequest,
    (req, res) => getAllAssociatedCaptions(req.params.id)
        .then(result => {
            if (result.error) {
                res.status(404).json(result);
            }
            else {
                res.status(200).json(result);
            }
        })
        .catch(err => res.status(500).json(err))
);

// Add new match to database
app.post(
	`${baseURL}/matches`,
	isLoggedIn,
	body().isArray().isLength(3),
    body("*.roundId").isInt({min: 1, max: 3}),
    body("*.memeId").isInt({min: 1}),
    body("*.name").isLength({min: 1}),
	body("*.guessed").isBoolean(),
	validateRequest,
	(req, res) => registerMatch(req.user, req.body)
		.then(result => {
			if (result.error) {
				res.status(404).json(result);
			}
			else {
				res.status(200).end();
			}
		})
		.catch(err => res.status(500).json(err))
);

// Get matches history
app.get(
    `${baseURL}/matches/history`,
    isLoggedIn,
    (req, res) => getUserMatchesHistory(req.user)
        .then(result => {
            if (result.error) {
                res.status(404).json(result);
            }
            else {
                res.status(200).json(result);
            }
        })
        .catch(err => res.status(500).json(err))
);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});