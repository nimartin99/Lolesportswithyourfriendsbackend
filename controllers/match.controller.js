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

        // Create a new match day if this match day was never created before by another match that was created on this day
        const matchDays = await db.MatchDayModel.find({});
        const matchDay = matchDays.find((day) => {
            if(day.date.toDateString() === dateTime.toDateString()) {
                return day;
            }
        })

        if(matchDay) {
            await db.MatchDayModel.findByIdAndUpdate(matchDay._id, {
                $push: { matches: newMatch },
            });
        } else {
            await db.MatchDayModel.create({
                date: new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate()),
                matches: newMatch,
            });
        }

        res.status(201).send({ newMatch });
    } else {
        res.status(500).send();
    }
};

exports.getMatches = async (req, res) => {
    const allMatches = await db.MatchModel.find({})
        .populate('team1')
        .populate('team2')
    res.status(200).send({ matches: allMatches });
};

exports.getMatchDays = async (req, res) => {
    const allMatchDays = await db.MatchDayModel.find({})
        .populate({ path: 'matches', populate: [
                { path: 'team1' },
                { path: 'team2' },
            ]});
    res.status(200).send({ matchDays: allMatchDays });
};