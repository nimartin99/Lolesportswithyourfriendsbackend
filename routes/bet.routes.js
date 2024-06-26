const { authJwt } = require("../middlewares");
const controller = require("../controllers/bet.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/bet",
        [authJwt.verifyToken], controller.postBet
    );

    app.get(
        "/api/myroster/:matchDate",
        [authJwt.verifyToken], controller.getMyRoster
    );

    app.get(
        "/api/bets/:matchDate",
        [authJwt.verifyToken], controller.getBetsOnMatchDay
    );

    app.get(
        "/api/bet/matchDay/:matchDate/account/:accountId",
        [authJwt.verifyToken], controller.getBetFromAccountOnMatchDay
    );
};