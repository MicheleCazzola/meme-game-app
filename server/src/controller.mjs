import { addMatch, addRound, getCorrectCaptions, getNotAssociatedCaptions, getRandomMemes, userLogin, getUserMatches, getRoundsOfMatch } from "./dao.mjs"
import { Match, MemeRound } from "./models.mjs";

// Caption shuffle
const shuffle = (correctCaptions, otherCaptions) => {
    return [...correctCaptions, ...otherCaptions]  
    .map(caption => {
        return {
            ...caption, 
            key: 7 * Math.random()
        };
    })
    .sort((a ,b) => a.key - b.key)
    .map(captionObj => {
        return {
            captionId: captionObj.captionId,
            text: captionObj.text 
        }
    });
}

// Authentication - User

// Login
async function getUser(username, password) {
    const result = await userLogin(username, password);
    return result;
}

// Memes

// Get different memes and captions requested
async function getMatchMemes(numberOfMemes) {
    const memes = await getRandomMemes(numberOfMemes);

    let gameRounds = [];
    for (let meme of memes) {
        const correctCaptions = await getCorrectCaptions(meme.memeId, 2);
            
        if (correctCaptions.error) {
            return correctCaptions;
        }

        const otherCaptions = await getNotAssociatedCaptions(meme.memeId);

        if (otherCaptions.error) {
            return otherCaptions;
        }

        const captions = shuffle(correctCaptions, otherCaptions);

        const gameRound = new MemeRound(meme.memeId, meme.name, captions);

        gameRounds.push(gameRound);
    };

    return gameRounds;
}

// Captions

// Get all associated captions for a given meme
async function getAllAssociatedCaptions(memeId) {
    const captions = await getCorrectCaptions(memeId, undefined);
    if (captions.error) {
        return captions;
    }
    return captions;
}

// Matches

// Insert a new match
async function registerMatch(user, rounds) {
    const matchId = await addMatch(user.userId);
    for (let round of rounds) {
        const result = await addRound(
            matchId,
            round.roundId,
            round.guessed,
            round.memeId
        );

        if (!result) {
            return;
        }
    }

    return true;
}

// Retrieves data of matches of a given user
async function getUserMatchesHistory(user) {
    const matchesData = await getUserMatches(user.userId);

    let matchesHistory = [];
    for (let matchData of matchesData) {
        const rounds = await getRoundsOfMatch(matchData.matchId);

        if (rounds.error) {
            return rounds;
        }

        const newMatch = new Match(
            matchData.matchId,
            matchData.date,
            rounds
        );

        matchesHistory.push(newMatch);
    }

    return matchesHistory;
}


export {getUser, getMatchMemes, getAllAssociatedCaptions, registerMatch, getUserMatchesHistory}