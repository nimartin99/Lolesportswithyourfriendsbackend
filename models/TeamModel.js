const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    abbreviation: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('Team', dataSchema)