const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.AccountModel = require("./AccountModel");
db.RoleModel = require("./RoleModel");
db.TeamModel = require("./TeamModel");
db.PlayerModel = require("./PlayerModel");
db.MatchModel = require("./MatchModel");
db.BetModel = require("./BetModel");
db.EvaluationModel = require("./EvaluationModel");
db.PlayerEvaluationModel = require("./PlayerEvaluationModel");

db.ROLES = ["user", "admin"];

module.exports = db;