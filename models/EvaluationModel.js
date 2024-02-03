const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    winnerTeam: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
})

module.exports = mongoose.model('Evaluation', dataSchema)