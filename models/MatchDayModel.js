const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date
    },
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match',
    }],
    bets: [{
        type: Schema.Types.ObjectId,
        ref: 'Bet',
    }],
    state: {
        type: String,
    }
})

module.exports = mongoose.model('MatchDay', dataSchema)