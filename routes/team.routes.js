const { authJwt } = require("../middlewares");
const teamController = require("../controllers/team.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/teams",
        [authJwt.verifyToken], teamController.getTeams
    );

    app.patch(
        "/api/team",
        [authJwt.verifyToken], teamController.patchTeam
    );
};