const { authJwt, verifySignUp} = require("../middlewares");
const controller = require("../controllers/match.controller");
const teamController = require("../controllers/team.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/match",
        [authJwt.verifyToken], controller.postMatch
    );

    app.get(
        "/api/matches",
        [authJwt.verifyToken], controller.getMatches
    );
};