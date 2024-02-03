const db = require("./../models");

exports.postMatch = async (req, res) => {
    if(!(typeof req.body.team1 === "string" && typeof req.body.team2 === "string" && typeof req.body.dateTime === "string")) {
        res.status(500).send();
    }

    const team1 = await db.TeamModel.findById(req.body.team1);
    const team2 = await db.TeamModel.findById(req.body.team2);


    if(team1 && team2) {
        const dateTime = new Date(req.body.dateTime);
        const newMatch = await db.MatchModel.create({
            team1,
            team2,
            dateTime,
        });
        res.status(201).send({ newMatch });
    } else {
        res.status(500).send();
    }
};

exports.getMatches = async (req, res) => {
    const allMatches = await db.MatchModel.find({})
        .populate('team1')
        .populate('team2')
        .populate('bets')
        .populate('evaluation');
    res.status(200).send({ matches: allMatches });
};