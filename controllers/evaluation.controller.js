const db = require("./../models");

exports.postEvaluation = async (req, res) => {
    let match = await db.MatchModel.findById(req.body.matchId).populate('evaluation');
    const team = await db.TeamModel.findById(req.body.winnerTeamId);

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