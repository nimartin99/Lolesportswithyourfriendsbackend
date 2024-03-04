const db = require("./../models");

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
        };
        const bluePlayerEvaluation = await db.PlayerEvaluationModel.create(Object.assign({}, bluePlayer));
        blueTeamPlayers.push(bluePlayerEvaluation);

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
        };
        const redPlayerEvaluation = await db.PlayerEvaluationModel.create(Object.assign({}, redPlayer));
        redTeamPlayers.push(redPlayerEvaluation);
    }

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


    if(match.evaluation) {
        evaluation = await db.EvaluationModel.findByIdAndUpdate(match.evaluation, Object.assign({}, evaluation))
    } else {
        evaluation = await db.EvaluationModel.create(Object.assign({}, evaluation))
    }
    await db.MatchModel.findByIdAndUpdate(req.body.matchId, {
        evaluation,
    });

    res.status(201).send({ match });
};