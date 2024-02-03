const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    account: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    team: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
})

module.exports = mongoose.model('Bet', dataSchema)