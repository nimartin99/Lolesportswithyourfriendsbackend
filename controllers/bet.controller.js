const db = require("./../models");
const evaluationActions = require("../actions/evaluation.actions");

exports.postBet = async (req, res) => {
    const matchDate = new Date(req.body.matchDate);
    // Check if there is already a bet for match day from this account
    const matchDays = await db.MatchDayModel.find();
    const matchDayUnpopulated = matchDays.find((matchDay) => {
        return matchDay.date.getTime() === matchDate.getTime();
        // console.log(typeof matchDay.date, matchDay.date, ' === ', typeof matchDate, matchDate, ' -> ', matchDay.date.getTime() === matchDate.getTime());
    })

    // If the bet is made for a day that doesn't exist as matchDay
    if(!matchDayUnpopulated) {
        res.status(404).send({ error: "No match day found for the given bet. Maybe we can't process your timezone correctly."});
        return;
    }
    const matchDay = await db.MatchDayModel.findOne(matchDayUnpopulated._id)
        .populate("bets")
        .populate("matches");

    // Check if there is already a bet for this match day from this account
    let betFromThisAccount = null;
    // Check if there even are any bets already
    if(matchDay.bets) {
        for (let i = 0; i < matchDay.bets.length; i++) {
            if (matchDay.bets[i].account.toString() === req.accountId) {
                betFromThisAccount = matchDay.bets[i];
                break;
            }
        }
    }

    // Find the first match of the day
    let firstMatchOfMatchDay = null;
    matchDay.matches.map((match) => {
        if(firstMatchOfMatchDay === null || firstMatchOfMatchDay.dateTime.getTime() > match.dateTime.getTime()) {
            firstMatchOfMatchDay = match;
        }
    });

    if(firstMatchOfMatchDay === null) {
        res.status(404).send({ error: "No match on the day you want to place the bet."});
    }

    // Only place bet if it's placed tes before the first match of the day starts
    if(new Date().getTime() > firstMatchOfMatchDay.dateTime.getTime() - (15 * 60 * 1000)) {
        res.status(403).send({ error: "You can only save your roster until 15 minutes before the first game starts."});
        return;
    }

    // Check if there is a maximum of 2 players per team in the roster
    const playersAmountPerTeam = {};
    const players = [ req.body.topPlayer, req.body.junglePlayer, req.body.midPlayer, req.body.botPlayer, req.body.supportPlayer ];
    players.forEach((player) => {
        if(playersAmountPerTeam[player.team]) {
            playersAmountPerTeam[player.team]++;
        } else {
            playersAmountPerTeam[player.team] = 1;
        }
    })
    console.log(playersAmountPerTeam);
    for (const teamId in playersAmountPerTeam) {
        if (playersAmountPerTeam[teamId] > 2) {
            // More than 2 players found for this team
            res.status(403).send({ error: "The roster has more than 2 players of the same team (excluding coach)."});
        }
    }

    if(betFromThisAccount !== null) {
        await db.BetModel.findByIdAndUpdate(betFromThisAccount._id, {
            account: req.accountId,
            topPlayer: req.body.topPlayer,
            junglePlayer: req.body.junglePlayer,
            midPlayer: req.body.midPlayer,
            botPlayer: req.body.botPlayer,
            supportPlayer: req.body.supportPlayer,
            coachPlayer: req.body.coachPlayer,
        });
    } else {
        const bet = await db.BetModel.create({
            account: req.accountId,
            topPlayer: req.body.topPlayer,
            junglePlayer: req.body.junglePlayer,
            midPlayer: req.body.midPlayer,
            botPlayer: req.body.botPlayer,
            supportPlayer: req.body.supportPlayer,
            coachPlayer: req.body.coachPlayer,
        });
        await db.MatchDayModel.findByIdAndUpdate(matchDay._id, {
            $push: { bets: bet },
        });
    }
    res.status(201).send();
};

exports.getMyRoster = async (req, res) => {
    // Check if there is already a bet for match day from this account
    const matchDay = await db.MatchDayModel.findOne({
        date: req.params.matchDate,
    }).populate("bets");

    // If no match day is found
    if(!matchDay) {
        res.status(404).send({ error: "No match day found."});
        return;
    }

    // Check if there is already a bet for this match day from this account
    let betFromThisAccount = null;
    // Check if there even are any bets already
    if(matchDay.bets) {
        for (let i = 0; i < matchDay.bets.length; i++) {
            if (matchDay.bets[i].account.toString() === req.accountId) {
                betFromThisAccount = matchDay.bets[i];
                break;
            }
        }
    }

    if(betFromThisAccount != null) {
        const betFromAccount = await db.BetModel.findById(betFromThisAccount._id)
            .populate({ path: 'topPlayer'})
            .populate({ path: 'junglePlayer'})
            .populate({ path: 'midPlayer'})
            .populate({ path: 'botPlayer'})
            .populate({ path: 'supportPlayer'})
            .populate({ path: 'coachPlayer'});
        res.status(200).send(betFromAccount);
    } else {
        res.status(404).send();
    }
};

exports.getBetsOnMatchDay = async (req, res) => {
    const matchDay = await db.MatchDayModel.findOne({ _id: req.params.matchDate })
        .populate("bets")
        .populate({ path: 'bets', populate: [
                { path: 'topPlayer' },
                { path: 'junglePlayer' },
                { path: 'midPlayer' },
                { path: 'botPlayer' },
                { path: 'supportPlayer' },
                { path: 'coachPlayer' },
            ]});
    if(!matchDay || !matchDay.bets) {
        res.status(404).send();
    } else {
        res.status(200).send(matchDay.bets);
    }
}

exports.getBetFromAccountOnMatchDay = async (req, res) => {
    const matchDay = await db.MatchDayModel.findOne({ _id: req.params.matchDate })
        .populate("bets")
        .populate({ path: 'matches', populate: { path: 'evaluation' }});
    if(!matchDay || !matchDay.bets) {
        res.status(404).send();
        return;
    }

    const betFromAccount = matchDay.bets.find((bet) => bet.account.equals(req.params.accountId));

    if(betFromAccount) {
        res.status(200).send(betFromAccount);
    } else {
        res.status(404).send();
    }
}
