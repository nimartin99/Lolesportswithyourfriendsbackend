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
};