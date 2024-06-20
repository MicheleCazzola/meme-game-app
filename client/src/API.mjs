import { Round, Match, MemeRound, User } from "./models.mjs";

const SERVER_URL = "http://localhost:3001"

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/memegame/sessions', {
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
    const response = await fetch(SERVER_URL + '/memegame/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}

const API = {logIn, logOut};
export default API;