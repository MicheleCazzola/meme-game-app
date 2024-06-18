import sqlite from "sqlite3"
import { User } from "./models.mjs";
import crypto from "crypto"
import dayjs from "dayjs";
const DB_NAME = "db/memes.db"

const db = new sqlite.Database(DB_NAME, (err) => {
    if (err) {
        throw (err);
    }
});

// Performs user login
async function userLogin(username, password) {
    return new Promise((resolve, reject) => {
    	const sql = 'SELECT * FROM USER WHERE Username = ?';
      	db.get(sql, [username], (err, row) => {
			if (err) { 
				reject(err); 
			}
			else if (!row) { 
				resolve(false); 
			}
			else {
				const user = new User(row.Username, row.Name, row.Surname);
			
				crypto.scrypt(password, row.Salt, 32, function(err, hashedPassword) {
					if (err) { 
						reject(err)
					}
					else if (!crypto.timingSafeEqual(Buffer.from(row.Password, 'hex'), hashedPassword)) {
						resolve(false);
					}
					else {
						resolve(user);
					}
				});
			}
      	});
    });
}

// Retrieves user information
async function getUserInfo(username) {
	const query = 
		`	SELECT Username, Name, Surname
			FROM USER
			WHERE Username = ?
		`
	return new Promise((resolve, reject) => {
		db.get(query, [username], (err, row) => {
			if (err) {
				reject(err);
			}
			else if (!row) {
				resolve({error: "User not found"});
			}
			else {
				const user = new User(row.Username, row.Name, row.Surname);
				resolve(user);
			}
		});
	});
}

// Retrieves id of given user
async function getUserId(username) {
	const query = "SELECT UserId FROM USER WHERE Username = ?"
	return new Promise((resolve, reject) => {
		db.get(query, [username], (err, row) => {
			if (err) {
				reject(err);
			}
			else if (!row) {
				resolve({error: `User ${username} not found`});
			}
			else {
				resolve(row.UserId);
			}
		});
	});
}

// Retrieves random memes from the database, in the specified quantity
async function getRandomMemes(number) {
    const query =
        `   SELECT Name
            FROM MEME
            ORDER BY RANDOM()
            LIMIT ?
        `
    return new Promise((resolve, reject) => {
        db.all(query, [number], (err, rows) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else if (rows.length < number) {
                reject({error: `${number} memes not found`});
            }
            else {
                const memeNames = rows.map(row => row.Name);
                resolve(memeNames);
            }
        })
    })
}

// Retrieves two correct captions for the specified meme
async function getCorrectCaptions(memeName) {
    const correctCaptions = 2;
    const query =
        `   SELECT Text 
            FROM CAPTION AS C, CORRECT_CAPTION AS CC, MEME AS M
            WHERE C.CaptionId = CC.CaptionId AND CC.MemeId = M.MemeId AND M.Name = ?
            ORDER BY RANDOM()
            LIMIT ${correctCaptions}
        `;
    return new Promise((resolve, reject) => {
        db.all(query, [memeName], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (rows.length < correctCaptions) {
                resolve({error: `Two associated captions not found for meme '${memeName}'`});
            }
            else {
                const captions = rows.map(row => row.Text);
                resolve(captions);
            }
        })
    })
}

// Retrieves five captions that are not associated to the specified meme
async function getNotAssociatedCaptions(memeName) {
    const notAssociatedCaptions = 5;
    const query = 
        `   SELECT Text
            FROM CAPTION AS C  
            WHERE C.CaptionId NOT IN (
                SELECT CC.CaptionId
                FROM CORRECT_CAPTION AS CC, MEME AS M
                WHERE M.MemeId = CC.MemeId AND M.Name = ?
            )
            ORDER BY RANDOM()
            LIMIT ${notAssociatedCaptions}
        `;
    return new Promise((resolve, reject) => {
        db.all(query, [memeName], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (rows.length < notAssociatedCaptions) {
                resolve({error: `Five non associated captions not found for meme '${memeName}'`});
            }
            else {
                const captions = rows.map(row => row.Text);
                resolve(captions);
            }
        });
    });
}

// Retrieves id of a meme, given the name
async function getMemeId(memeName) {
	const query = "SELECT MemeId FROM MEME WHERE Name = ?";
	return new Promise((resolve, reject) => {
		db.get(query, [memeName], (err, row) => {
			if (err) {
				reject(err);
			}
			else if (!row) {
				resolve({error: `Meme ${memeName} not found`});
			}
			else {
				resolve(row.MemeId);
			}
		});
	});
}

// Retrieves id of a caption, given the text
async function getCaptionId(captionText) {
	const query = "SELECT CaptionId FROM CAPTION WHERE Text = ?";
	return new Promise((resolve, reject) => {
		db.get(query, [captionText], (err, row) => {
			if (err) {
				reject(err);
			}
			else if (!row) {
				resolve({error: `Caption '${captionText}' not found`});
			}
			else {
				resolve(row.CaptionId);
			}
		});
	});
}

// Inserts a new match and returns its id
async function addMatch(userId) {
	const today = dayjs().format("YYYY-MM-DD");
	const query = "INSERT INTO MATCH (UserId, Date) VALUES (?, ?)";
	return new Promise((resolve, reject) => {
		db.run(query, [userId, today], function (err) {
			if (err) {
				reject(err);
			}
			else {
				resolve(this.lastID);
			}
		});
	});
}

// Inserts a new played round
async function addRound(matchId, roundId, guessed, memeId, captionId) {
	const query = 
		`	INSERT INTO ROUND(MatchId, RoundId, Guessed, MemeId, CaptionId)
			VALUES (?, ?, ?, ?, ?)
		`;
	return new Promise((resolve, reject) => {
		db.run(query, [matchId, roundId, guessed, memeId, captionId], function (err) {
			console.log(err);
			if (err) {
				reject (err);
			}
			else {
				resolve(true);
			}
		});
	});
}

export {userLogin, getUserInfo, getUserId, getRandomMemes, getCorrectCaptions, getNotAssociatedCaptions, getMemeId, getCaptionId, addMatch, addRound};