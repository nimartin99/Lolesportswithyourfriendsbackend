const { authJwt, verifySignUp} = require("../middlewares");
const controller = require("../controllers/evaluation.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/evaluation",
        [authJwt.verifyToken], controller.postEvaluation
    );

};