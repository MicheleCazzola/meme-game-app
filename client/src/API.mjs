import { Round, Match, MemeRound, User } from "./models.mjs";

const SERVER_URL = "http://localhost:3001"
const BASE_URL = "/api"

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
        return new User(user.username, user.userId);
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

const getUserInfo = async () => {
    const response = await fetch(`${SERVER_URL}${BASE_URL}/sessions/current`, {
        method: "GET",
        credentials: "include"
    });

    if (response.ok) {
        const user = await response.json();
        return new User(user.username, user.userId);
    }
    const errDetails = await response.json();
    throw errDetails;
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
        return gameData.map(round => new MemeRound(round.memeId, round.name, round.captions));
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

const saveGameResults = async (gameObj) => {
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

const getHistory = async () => {
    const response = await fetch(`${SERVER_URL}${BASE_URL}/matches/history`, {
        method: "GET",
        credentials: "include"
    });

    if(response.ok) {
        const results = await response.json();
        return results.map(result => new Match(result.matchId, result.date, result.points, result.rounds));
    }
    const errDetails = await response.json();
    return errDetails;
}

const API = {logIn, getUserInfo, logOut, getGameData, getCorrectCaptions, saveGameResults, getHistory};
export {API, SERVER_URL};