const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    role: {
        required: true,
        type: String
    },
})

module.exports = mongoose.model('Role', dataSchema)