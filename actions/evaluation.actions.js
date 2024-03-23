const db = require("../models");

exports.getEvaluationsOfMatchDay = async (matchDay) => {
    const matchDayEvaluations = [];
    await Promise.all(matchDay.matches.map(async (match) => {
        if(match.evaluation) {
            const evaluation = await db.EvaluationModel.findById(match.evaluation);
            let i;
            let j = 6;
            for (i = 0; i < j; i++) {
                evaluation.blueTeam.players[i] = await db.PlayerEvaluationModel.findById(evaluation.blueTeam.players[i]);
                evaluation.redTeam.players[i] = await db.PlayerEvaluationModel.findById(evaluation.redTeam.players[i]);
            }
            matchDayEvaluations.push(evaluation);
        }
    }));
    return matchDayEvaluations;
};
