require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const history = require('connect-history-api-fallback');
const mongoString = process.env.DATABASE_URL;

const app = express();

// Enable for restricting use of API only from frontend
// var corsOptions = {
//     origin: "http://localhost:80"
// };
app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use connect history api fallback
app.use(history());

// simple route
app.get("/backend", (req, res) => {
    res.json({ message: "Hello from lolesportswithyourfriends backend." });
});

const options = {
    // key: fs.readFileSync('server.key'),
    // cert: fs.readFileSync('server.cert')
};

// set port, listen for requests
const PORT = process.env.PORT || 3000;

// http.createServer(options, app).listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


const db = require("./models");

db.mongoose
    .connect(mongoString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


const routes = require('./routes/routes');
const accountRoutes = require('./routes/accountRoutes');

app.use('/api', routes);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/team.routes')(app);
require('./routes/match.routes')(app);
require('./routes/bet.routes')(app);
require('./routes/evaluation.routes')(app);

async function initial() {
    const allRoles = db.AccountModel.find({});
    if(allRoles.length === 0) {
        await db.AccountModel.create({
            type: 'user',
        })
    }

    let teams = ["G2 Esports", "Fnatic", "Team BDS", "SK Gaming", "Team Vitality", "Team Heretics", "MAD Lions KOI", "GIANTX", "Rogue", "Karmine Corp"];
    const abbreviations = ["G2", "FNC", "BDS", "SK", "VIT", "TH", "MDK", "GX", "RGE", "KC"];

    // Check if teams need to be created
    const allTeams = await db.TeamModel.find({});
    if(allTeams.length === 0) {
        await Promise.all(teams.map(async (team, index) => {
            await db.TeamModel.create({
                name: team,
                abbreviation: abbreviations[index],
            })
        }))
    }

    const roles = ['coach', 'top', 'jungle', 'mid', 'bot', 'support'];
    teams = await db.TeamModel.find({}).populate("players");

    // Clear all players from teams
    // await Promise.all(teams.map(async (team) => {
    //     await db.TeamModel.findByIdAndUpdate(team._id, {
    //         players: [],
    //     })
    // }))

    await Promise.all(teams.map(async (team) => {
        await Promise.all(roles.map(async role => {
            if(!team.players.some(player => player.role === role)) {
                const player = await db.PlayerModel.create({
                    name: 'Unknown',
                    role: role,
                    team: team._id,
                });
                await db.TeamModel.findByIdAndUpdate(team._id, {
                    $push: { players: player._id  },
                })
            }
        }))
    }))
}