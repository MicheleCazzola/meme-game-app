// Get round statistics
function Round(meme, guessed, caption) {
    this.meme = meme;
    this.guessed = guessed;
    this.caption = caption;
}

// Get match statistics
function Match(date, points, rounds) {
    this.date = date;
    this.points = points;
    this.rounds = rounds;
}

// Get meme for a round
function MemeRound(name, correctCaptions, otherCaptions) {
    this.name = name;
    this.correctCaptions = correctCaptions; 
    this.otherCaptions = otherCaptions;
}

// Get user info
function User(username, name, surname) {
    this.username = username;
    this.name = name;
    this.surname = surname;
}

export {Round, Match, MemeRound, User}