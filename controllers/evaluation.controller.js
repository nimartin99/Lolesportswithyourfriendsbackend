const db = require("./../models");

exports.postEvaluation = async (req, res) => {
    let match = await db.MatchModel.findById(req.body.matchId).populate('evaluation');
    const team = await db.TeamModel.findById(req.body.winnerTeamId);

    const blueTeam = req.body.blueTeam;
    const redTeam = req.body.redTeam;

    const blueTeamPlayers = [];
    const redTeamPlayers = [];

    for (let i = 0; i <= 4; i++) {
        const bluePlayer = {
            player: blueTeam.players[i].playerId,
            kills: blueTeam.players[i].kills,
            deaths: blueTeam.players[i].deaths,
            assists: blueTeam.players[i].assists,
            killParticipation: blueTeam.players[i].killParticipation,
            damageShare: blueTeam.players[i].damageShare,
            champion: blueTeam.players[i].champion,
            level: blueTeam.players[i].level,
            goldEarned: blueTeam.players[i].goldEarned,
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
        }
        // wait for the promise to resolve before advancing the for loop
        response = await this.requestTwoPlayerStats(matchId, timestamp, i);
    }

    const evaluation = {
        blueTeam: {
            kills: blueTeam.kills,
            towers: blueTeam.towers,
            inhibitors: : blueTeam.inhibitors,
            dragons: blueTeam.dragons,
            totalGold: blueTeam.totalGold,
            players: blueTeamPlayers,
        }
    }

    if(match && team) {
        let evaluation;
        if(match.evaluation) {
            evaluation = await db.EvaluationModel.findByIdAndUpdate(match.evaluation, {
                winnerTeam: team._id
            })
        } else {
            evaluation = await db.EvaluationModel.create({
                winnerTeam: team._id
            })
        }
        await db.MatchModel.findByIdAndUpdate(req.body.matchId, {
            evaluation,
        });

        res.status(201).send({ match });
    }
};