const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    team1: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    team2: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    dateTime: {
        required: true,
        type: Date
    },
    evaluation: {
        type: Schema.Types.ObjectId,
        ref: 'Evaluation'
    },
    boEvaluations: [{
        type: Schema.Types.ObjectId,
        ref: 'Evaluation'
    }],
    matchType: {
        type: String,
    }
})

module.exports = mongoose.model('Match', dataSchema)