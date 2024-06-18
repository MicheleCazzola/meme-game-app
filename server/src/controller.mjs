import { addMatch, addRound, getCaptionId, getCorrectCaptions, getMemeId, getNotAssociatedCaptions, getRandomMemes, getUserId, userLogin } from "./dao.mjs"
import { MemeRound } from "./models.mjs";

// Authentication - User

// Login
async function getUser(username, password) {
    const result = await userLogin(username, password);
    return result;
}

// Get user information
async function getUserInfo(user) {
    const result = await getUserInfo(user.username);
    return result;
}

// Memes

// Get three different memes and caption requested
async function getMatchMemes() {
    const numberOfMemes = 3;
    const memes = await getRandomMemes(numberOfMemes);

    let gameRounds = [];
    for (let meme of memes) {
        try {
            const correctCaptions = await getCorrectCaptions(meme);
            
            if (correctCaptions.error) {
                return {error: correctCaptions.error};
            }

            const otherCaptions = await getNotAssociatedCaptions(meme);

            if (otherCaptions.error) {
                return {error: otherCaptions.error};
            }

            const gameRound = new MemeRound(meme, correctCaptions, otherCaptions);

            gameRounds.push(gameRound);
        } catch (error) {
            console.log(error);
        }
    };

    return gameRounds;
}

// Get a single meme and the requested caption
async function getSingleRoundMeme() {
    const numberOfMemes = 1;
    const meme = (await getRandomMemes(numberOfMemes))[0];
    const correctCaptions = await getCorrectCaptions(meme);
    if (correctCaptions.error) {
        return {error: correctCaptions.error};
    }
    const otherCaptions = await getNotAssociatedCaptions(meme);
    if (otherCaptions.error) {
        return {error: otherCaptions.error};
    } 

    const gameRound = new MemeRound(meme, correctCaptions, otherCaptions);

    return gameRound;
}

// Matches

// Insert a new match
async function registerMatch(user, rounds) {
    console.log(user);
    console.log(rounds);
    const userId = await getUserId(user.username);

    if (userId.error) {
        return userId;
    }

    let memeIds = [];
    let captionIds = [];
    for (let round of rounds) {
        const memeId = await getMemeId(round.meme);
        console.log(memeId);

        if (memeId.error) {
            return memeId;
        }

        let captionId = null;
        if (round.caption) {
            captionId = await getCaptionId(round.caption);
            if (captionId.error) {
                return captionId;
            }
        }

        if (captionId === null && round.guessed) {
            return;
        }

        memeIds.push(memeId);
        captionIds.push(captionId);
    }

    const matchId = await addMatch(userId);

    for (let i = 0; i < 3; i++) {
        const result = await addRound(matchId, i+1, rounds[i].guessed, memeIds[i], captionIds[i]);

        if (!result) {
            return;
        }
    }

    return true;
}

export {getUser, getUserInfo, getMatchMemes, getSingleRoundMeme, registerMatch}