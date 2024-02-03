const db = require("./../models");

exports.getTeams = async (req, res) => {
    const allTeams = await db.TeamModel.find({});
    res.status(200).send({ teams: allTeams });
};