// Get round statistics
function Round(roundId, meme, guessed) {
    this.roundId = roundId;
    this.meme = meme;
    this.points = 5 * guessed;
}

// Get match statistics
function Match(matchId, date, rounds) {
    this.matchId = matchId;
    this.date = date;
    this.points = rounds
        .map(round => round.points)
        .reduce((a, b) => a + b);
    this.rounds = rounds;
}

// Get meme for a round
function MemeRound(memeId, name, correctCaptions, otherCaptions) {
    this.memeId = memeId;
    this.name = name;
    this.correctCaptions = correctCaptions; 
    this.otherCaptions = otherCaptions;
}

// Get user info
function User(username, userId) {
    this.userId = userId;
    this.username = username;
}

export {Round, Match, MemeRound, User}