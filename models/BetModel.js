const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    account: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    topPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    junglePlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    midPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    botPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    supportPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    coachPlayer: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    score: {
        required: false,
        type: Number,
    }
})

module.exports = mongoose.model('Bet', dataSchema)