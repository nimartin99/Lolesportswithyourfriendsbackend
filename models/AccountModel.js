const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String,
        select: false
    },
    role: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'Role'
    },
    score: {
        required: false,
        type: Number,
    }
})

module.exports = mongoose.model('Account', dataSchema)