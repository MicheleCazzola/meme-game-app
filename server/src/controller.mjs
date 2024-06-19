import { addMatch, addRound, getCorrectCaptions, getNotAssociatedCaptions, getRandomMemes, userLogin, getUserMatches, getRoundsOfMatch } from "./dao.mjs"
import { Match, MemeRound } from "./models.mjs";

// Authentication - User

// Login
async function getUser(username, password) {
    const result = await userLogin(username, password);
    return result;
}

// Memes

// Get three different memes and caption requested
async function getMatchMemes() {
    const numberOfMemes = 3;
    const memes = await getRandomMemes(numberOfMemes);

    let gameRounds = [];
    for (let meme of memes) {
        const correctCaptions = await getCorrectCaptions(meme.name);
            
        if (correctCaptions.error) {
            return correctCaptions;
        }

        const otherCaptions = await getNotAssociatedCaptions(meme.name);

        if (otherCaptions.error) {
            return otherCaptions;
        }

        const gameRound = new MemeRound(meme.memeId, meme.name, correctCaptions, otherCaptions);

        gameRounds.push(gameRound);
    };

    return gameRounds;
}

// Get a single meme and the requested caption
async function getSingleRoundMeme() {
    const numberOfMemes = 1;

    const meme = (await getRandomMemes(numberOfMemes))[0];
    if (meme.error) {
        return meme;
    }

    const correctCaptions = await getCorrectCaptions(meme.name);
    if (correctCaptions.error) {
        return correctCaptions;
    }

    const otherCaptions = await getNotAssociatedCaptions(meme.name);
    if (otherCaptions.error) {
        return otherCaptions;
    } 

    const gameRound = new MemeRound(meme.memeId, meme.name, correctCaptions, otherCaptions);

    return gameRound;
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
        console.log(matchData);
        const rounds = await getRoundsOfMatch(matchData.matchId);

        if (rounds.error) {
            return rounds;
        }

        const newMatch = new Match(
            matchData.matchId,
            matchData.date,
            rounds
        );

        console.log(newMatch);

        matchesHistory.push(newMatch);
    }

    return matchesHistory;
}


export {getUser, getMatchMemes, getSingleRoundMeme, registerMatch, getUserMatchesHistory}