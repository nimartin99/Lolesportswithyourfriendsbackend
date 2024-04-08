const db = require("./../models");
const evaluationActions = require("../actions/evaluation.actions");

exports.postEvaluation = async (req, res) => {
    let match = await db.MatchModel.findById(req.body.matchId).populate('evaluation');
    const team = await db.TeamModel.findById(req.body.winnerTeamId);

    const blueTeam = req.body.blueTeam;
    const redTeam = req.body.redTeam;

    const blueTeamPlayers = [];
    const redTeamPlayers = [];

    for (let i = 0; i <= 4; i++) {
        const bluePlayerDB = await db.PlayerModel.findOne({
            name: blueTeam.players[i].name,
        })

        const bluePlayer = {
            player: bluePlayerDB._id,
            kills: blueTeam.players[i].kills,
            deaths: blueTeam.players[i].deaths,
            assists: blueTeam.players[i].assists,
            killParticipation: blueTeam.players[i].killParticipation,
            championDamageShare: blueTeam.players[i].championDamageShare,
            championId: blueTeam.players[i]. championId,
            level: blueTeam.players[i].level,
            totalGoldEarned: blueTeam.players[i].totalGoldEarned,
            creepScore: blueTeam.players[i].creepScore,
            attackDamage: blueTeam.players[i].attackDamage,
            criticalChance: blueTeam.players[i].criticalChance,
            attackSpeed: blueTeam.players[i].attackSpeed,
            abilityPower: blueTeam.players[i].abilityPower,
            armor: blueTeam.players[i].armor,
            magicResistance: blueTeam.players[i].magicResistance,
            tenacity: blueTeam.players[i].tenacity,
            lifeSteal: blueTeam.players[i].lifeSteal,
            wardsPlaced: blueTeam.players[i].wardsPlaced,
            wardsDestroyed: blueTeam.players[i].wardsDestroyed,
            basePoints: blueTeam.players[i].basePoints,
        };
        const bluePlayerEvaluation = await db.PlayerEvaluationModel.create(Object.assign({}, bluePlayer));
        blueTeamPlayers.push(bluePlayerEvaluation._id);

        const redPlayerDB = await db.PlayerModel.findOne({
            name: redTeam.players[i].name,
        })
        const redPlayer = {
            player: redPlayerDB._id,
            kills: redTeam.players[i].kills,
            deaths: redTeam.players[i].deaths,
            assists: redTeam.players[i].assists,
            killParticipation: redTeam.players[i].killParticipation,
            championDamageShare: redTeam.players[i].championDamageShare,
            championId: redTeam.players[i]. championId,
            level: redTeam.players[i].level,
            totalGoldEarned: redTeam.players[i].totalGoldEarned,
            creepScore: redTeam.players[i].creepScore,
            attackDamage: redTeam.players[i].attackDamage,
            criticalChance: redTeam.players[i].criticalChance,
            attackSpeed: redTeam.players[i].attackSpeed,
            abilityPower: redTeam.players[i].abilityPower,
            armor: redTeam.players[i].armor,
            magicResistance: redTeam.players[i].magicResistance,
            tenacity: redTeam.players[i].tenacity,
            lifeSteal: redTeam.players[i].lifeSteal,
            wardsPlaced: redTeam.players[i].wardsPlaced,
            wardsDestroyed: redTeam.players[i].wardsDestroyed,
            basePoints: redTeam.players[i].basePoints,
        };
        const redPlayerEvaluation = await db.PlayerEvaluationModel.create(Object.assign({}, redPlayer));
        redTeamPlayers.push(redPlayerEvaluation._id);
    }

    // Coach stuff
    const blueCoachPlayerDB = await db.PlayerModel.findOne({
        name: blueTeam.coach.name,
    })
    const blueTeamCoachEvaluation = await db.PlayerEvaluationModel.create({
        player: blueCoachPlayerDB._id,
        basePoints: blueTeam.coach.basePoints,
    });
    blueTeamPlayers.push(blueTeamCoachEvaluation._id);

    const redCoachPlayerDB = await db.PlayerModel.findOne({
        name: redTeam.coach.name,
    })
    const redTeamCoachEvaluation = await db.PlayerEvaluationModel.create({
        player: redCoachPlayerDB._id,
        basePoints: redTeam.coach.basePoints,
    });
    redTeamPlayers.push(redTeamCoachEvaluation._id);

    let evaluation = {
        winnerTeam: team._id,
        lolesportsMatchId: req.body.lolesportsMatchId,
        lolesportsTimestamp: req.body.lolesportsTimestamp,
        blueTeam: {
            totalKills: blueTeam.totalKills,
            towers: blueTeam.towers,
            inhibitors: blueTeam.inhibitors,
            dragons: blueTeam.dragons,
            totalGold: blueTeam.totalGold,
            players: blueTeamPlayers,
        },
        redTeam: {
            totalKills: redTeam.totalKills,
            towers: redTeam.towers,
            inhibitors: redTeam.inhibitors,
            dragons: redTeam.dragons,
            totalGold: redTeam.totalGold,
            players: redTeamPlayers,
        },
    };

    if(match.matchType === 'Bo1') {
        if(match.evaluation) {
            evaluation = await db.EvaluationModel.findByIdAndUpdate(match.evaluation, Object.assign({}, evaluation))
        } else {
            evaluation = await db.EvaluationModel.create(Object.assign({}, evaluation))
        }
        await db.MatchModel.findByIdAndUpdate(req.body.matchId, {
            $push: { evaluation: evaluation },
        });
    } else if(match.matchType === 'Bo3') {
        // 1
    } else if(match.matchType === 'Bo5') {

    }

    res.status(201).send({ match });
};

exports.getEvaluation = async (req, res) => {
    if(!req.params.evaluationId) {
        res.status(400).send();
    }
    const evaluation = db.EvaluationModel.findById(req.params.evaluationId)
        .populate({ path: 'blueTeam.players' })
        .populate({ path: 'readTeam.players' });
    console.log(evaluation);
    res.status(200).send( evaluation );
};

exports.getEvaluationsOfMatchDay = async (req, res) => {
    if(!req.params.matchDayId) {
        res.status(400).send();
        return;
    }
    const matchDay = await db.MatchDayModel.findById(req.params.matchDayId)
        .populate("matches");
    if(!matchDay) {
        res.status(400).send();
        return;
    }
    const matchDayEvaluations = await evaluationActions.getEvaluationsOfMatchDay(matchDay);
    res.status(200).send(matchDayEvaluations);
};

exports.finishMatchDay = async (req, res) => {
    const matchDay = await db.MatchDayModel.findById(req.body.matchDayId)
        .populate("matches")
        .populate({ path: "bets", populate: ["topPlayer", "junglePlayer", "midPlayer", "botPlayer", "supportPlayer", "coachPlayer"]});
    console.log(matchDay);
    if(!req.body.matchDayId || !matchDay) {
        res.status(400).send();
        return;
    }

    if(matchDay.state === "finished") {
        res.status(423).send();
        return;
    }

    const matchDayPlayerEvaluations = [];
    await Promise.all(matchDay.matches.map(async (match) => {
        if(match.evaluation) {
            const evaluation = await db.EvaluationModel.findById(match.evaluation);
            let i;
            let j = 6;
            for (i = 0; i < j; i++) {
                matchDayPlayerEvaluations.push(await db.PlayerEvaluationModel.findById(evaluation.blueTeam.players[i]));
                matchDayPlayerEvaluations.push(await db.PlayerEvaluationModel.findById(evaluation.redTeam.players[i]));
            }
        }
    }));
    // console.log(matchDayPlayerEvaluations);
    await Promise.all(matchDay.bets.map(async (bet) => {
        const topPlayer = matchDayPlayerEvaluations.find((playerEvaluation) => {
            if(playerEvaluation !== null && playerEvaluation.player.equals(bet.topPlayer._id)) {
                return playerEvaluation;
            }
        });
        const junglePlayer = matchDayPlayerEvaluations.find((playerEvaluation) => {
            if(playerEvaluation !== null && playerEvaluation.player.equals(bet.junglePlayer._id)) {
                return playerEvaluation;
            }
        });
        const midPlayer = matchDayPlayerEvaluations.find((playerEvaluation) => {
            if(playerEvaluation !== null && playerEvaluation.player.equals(bet.midPlayer._id)) {
                return playerEvaluation;
            }
        });
        const botPlayer = matchDayPlayerEvaluations.find((playerEvaluation) => {
            if(playerEvaluation !== null && playerEvaluation.player.equals(bet.botPlayer._id)) {
                return playerEvaluation;
            }
        });
        const supportPlayer = matchDayPlayerEvaluations.find((playerEvaluation) => {
            if(playerEvaluation !== null && playerEvaluation.player.equals(bet.supportPlayer._id)) {
                return playerEvaluation;
            }
        });
        const coachPlayer = matchDayPlayerEvaluations.find((playerEvaluation) => {
            if(playerEvaluation !== null && playerEvaluation.player.equals(bet.coachPlayer._id)) {
                return playerEvaluation;
            }
        });
        let accountScore = 0;
        if(topPlayer) {
            accountScore += topPlayer.basePoints;
        }
        if(junglePlayer) {
            accountScore += junglePlayer.basePoints;
        }
        if(midPlayer) {
            accountScore += midPlayer.basePoints;
        }
        if(botPlayer) {
            accountScore += botPlayer.basePoints;
        }
        if(supportPlayer) {
            accountScore += supportPlayer.basePoints;
        }
        if(coachPlayer) {
            accountScore += coachPlayer.basePoints;
        }
        await db.BetModel.findByIdAndUpdate(bet._id, {
            score: accountScore,
        });
        await db.AccountModel.findByIdAndUpdate(bet.account, {
            $inc: { score: accountScore }
        });
    }));

    await db.MatchDayModel.findByIdAndUpdate(matchDay._id, {
        state: 'finished',
    });


    res.status(200).send();
};