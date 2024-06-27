// Get round statistics
function Round(roundId, meme, guessed) {
    this.roundId = roundId;
    this.meme = meme;
    this.points = 5 * guessed;
}

// Get match statistics
function Match(matchId, date, points, rounds) {
    this.matchId = matchId;
    this.date = date;
    this.points = points;
    this.rounds = rounds;
}

// Get meme for a round
function MemeRound(memeId, name, captions) {
    this.memeId = memeId;
    this.name = name;
    this.captions = captions;
}

// Get user info
function User(username, userId) {
    this.userId = userId;
    this.username = username;
}

export {Round, Match, MemeRound, User}