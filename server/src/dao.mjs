import sqlite from "sqlite3"
import { Round, User } from "./models.mjs";
import crypto from "crypto"
import dayjs from "dayjs";
const DB_NAME = "db/memes.db"

async function setFKOn(database) {
	return new Promise((resolve, reject) => {
		database.run("PRAGMA FOREIGN_KEYS = ON", function(err) {
			if (err) {
				reject(err);
			}
			else {
				resolve(true);
			}
		})
	});
}

// Open database
const db = new sqlite.Database(DB_NAME, async (err) => {
	if (err) {
		throw (err);
	}
});

await setFKOn(db);

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
				const user = new User(row.Username, row.UserId);
			
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
        `   SELECT MemeId, Name
            FROM MEME
            ORDER BY RANDOM()
            LIMIT ?
        `
    return new Promise((resolve, reject) => {
        db.all(query, [number], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (rows.length < number) {
                resolve({error: `${number} memes not found`});
            }
            else {
                const memes = rows.map(row => {
					return {
						memeId: row.MemeId,
						name: row.Name
					}
				});
                resolve(memes);
            }
        });
    });
}

// Retrieves two correct captions for the specified meme
async function getCorrectCaptions(memeName) {
    const correctCaptions = 2;
    const query =
        `   SELECT C.CaptionId as CaptionId, Text 
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
                const captions = rows.map(row => {
					return {
						captionId: row.CaptionId,
						text: row.Text
					}
				});
                resolve(captions);
            }
        });
    });
}

// Retrieves five captions that are not associated to the specified meme
async function getNotAssociatedCaptions(memeName) {
    const notAssociatedCaptions = 5;
    const query = 
        `   SELECT C.CaptionId as CaptionId, Text
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
                const captions = rows.map(row => {
					return {
						captionId: row.CaptionId,
						text: row.Text
					}
				});
                resolve(captions);
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
async function addRound(matchId, roundId, guessed, memeId) {
	const query = 
		`	INSERT INTO ROUND(MatchId, RoundId, Guessed, MemeId)
			VALUES (?, ?, ?, ?)
		`;
	return new Promise((resolve, reject) => {
		db.run(query, [matchId, roundId, guessed, memeId], function (err) {
			if (err) {
				reject (err);
			}
			else {
				resolve(true);
			}
		});
	});
}

// Get all matches of a given user
async function getUserMatches(userId) {
    const query = 
        `   SELECT MatchId, Date
            FROM MATCH 
            WHERE UserId = ?
			ORDER BY MatchId
        `;
    return new Promise((resolve, reject) => {
        db.all(query, [userId], (err, rows) => {
			if(err) {
				reject (err);
			}
			else {
				const matches = rows.map(row => {
					return {
						matchId: row.MatchId,
						date: row.Date
					}
				});
				resolve(matches);
			}
		});
    });
}

// Get rounds data for a given match
async function getRoundsOfMatch(matchId) {
	const numRoundsInMatch = 3;
	const query = 
		`	SELECT RoundId, Name, Guessed
			FROM ROUND AS R, MEME AS M
			WHERE R.MemeId = M.MemeId AND R.MatchId = ?
			ORDER BY RoundId
		`;
	return new Promise((resolve, reject) => {
		db.all(query, [matchId], (err, rows) => {
			if (err) {
				reject(err);
			}
			else if (rows.length < numRoundsInMatch) {
				resolve({error: `Wrong number of rounds from match: found ${rows.length}, expected ${numRoundsInMatch}`});
			}
			else {
				const rounds = rows.map(row => new Round(row.RoundId, row.Name, row.Guessed));
				resolve(rounds);
			}
		});
	});
}

export {userLogin, getUserId, getRandomMemes, getCorrectCaptions, getNotAssociatedCaptions, addMatch, addRound, getUserMatches, getRoundsOfMatch};