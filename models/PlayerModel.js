const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    role: {
        required: true,
        type: String,
    },
    team: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
})

module.exports = mongoose.model('Player', dataSchema)