const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const teamController = require("../controllers/team.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.allAccess);

    app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

    app.get("/api/user/account", [authJwt.verifyToken], controller.getAccount);

    app.get("/api/accounts", [authJwt.verifyToken], controller.getAccounts);
};