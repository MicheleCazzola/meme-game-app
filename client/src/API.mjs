import { Round, Match, MemeRound, User } from "./models.mjs";

const SERVER_URL = "http://localhost:3001"
const BASE_URL = "/memegame"
const MEMES_URL = "/meme"

const logIn = async (credentials) => {
    const response = await fetch(`${SERVER_URL}${BASE_URL}/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if(response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

const logOut = async() => {
    const response = await fetch(`${SERVER_URL}${BASE_URL}/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const getGameData = async (isLoggedIn) => {
    const gameType = isLoggedIn ? "/match" : "/single";
    const response = await fetch(`${SERVER_URL}${BASE_URL}/memes${gameType}`, {
        method: "GET",
        credentials: "include"
    });
    if (response.ok) {
        const gameData = await response.json();
        return gameData;
    }
    const errDetails = await response.json();
    throw errDetails;
}

const getCorrectCaptions = async (memeId) => {
    const response = await fetch(`${SERVER_URL}${BASE_URL}/memes/${memeId}/captions`, {
        method: "GET",
        credentials: "include"
    });
    if (response.ok) {
        const captionsJson = await response.json();
        return captionsJson;
    }
    const errDetails = await response.json();
    throw errDetails;
}

const saveGameResults = async(gameObj) => {
    const response = await fetch(`${SERVER_URL}${BASE_URL}/matches`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(gameObj)
    });

    if(response.ok) {
        return;
    }
    const errDetails = await response.json();
    throw errDetails;
}

const API = {logIn, logOut, getGameData, getCorrectCaptions, saveGameResults};
export {API, SERVER_URL};