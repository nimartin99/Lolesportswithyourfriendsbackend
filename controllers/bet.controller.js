const db = require("./../models");

exports.postBet = async (req, res) => {
    let match = await db.MatchModel.findById(req.body.matchId).populate('bets');
    const team = await db.TeamModel.findById(req.body.teamId);
    if (match && team) {
        // Check if there is already a bet for this match from this account
        let betFromThisAccount = null;
        for (let i = 0; i < match.bets.length; i++) {
            if (match.bets[i].account.toString() === req.accountId) {
                betFromThisAccount = match.bets[i];
                break;
            }
        }

        if(betFromThisAccount !== null) {
            console.log(betFromThisAccount);
            console.log(team);
            await db.BetModel.findByIdAndUpdate(betFromThisAccount._id, {
                account: req.accountId,
                team: team._id
            })
        } else {
            const bet = await db.BetModel.create({
                account: req.accountId,
                team: req.body.teamId
            });
            await db.MatchModel.findByIdAndUpdate(match._id, {
                $push: {
                    bets: bet,
                },
            });
        }

        // So that the bet is instantly in the response
        match = await db.MatchModel.findById(req.body.matchId);
        res.status(201).send({match});
    } else {
        res.status(500).send();
    }
};