const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    winnerTeam: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    lolesportsMatchId: {
        required: true,
        type: String,
    },
    lolesportsTimestamp: {
        required: true,
        type: Date,
    },
    blueTeam: {
        required: true,
        type: Object,
        teamId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'Team'
        },
        totalKills: {
            required: true,
            type: Number,
        },
        towers: {
            required: true,
            type: Number,
        },
        inhibitors: {
            required: true,
            type: Number,
        },
        dragons: {
            required: true,
            type: Array,
        },
        totalGold: {
            required: true,
            type: Number,
        },
        players: [{
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'PlayerEvaluation'
        }],
    },
    redTeam: {
        required: true,
        type: Object,
        teamId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'Team'
        },
        totalKills: {
            required: true,
            type: Number,
        },
        towers: {
            required: true,
            type: Number,
        },
        inhibitors: {
            required: true,
            type: Number,
        },
        dragons: {
            required: true,
            type: Array,
        },
        totalGold: {
            required: true,
            type: Number,
        },
        players: [{
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'PlayerEvaluation'
        }],
    }
})

module.exports = mongoose.model('Evaluation', dataSchema)