const db = require("./../models");

exports.getTeams = async (req, res) => {
    const allTeams = await db.TeamModel.find({})
        .populate("players");
    res.status(200).send({ teams: allTeams });
};

exports.patchTeam = async (req, res) => {
    const team = await db.TeamModel.findById(req.body._id);
    if(team) {
        await Promise.all(req.body.players.map(async (player) => {
            await db.PlayerModel.findByIdAndUpdate(player._id, player);
        }));
        res.status(200).send();
    }
    res.status(404).send();
};