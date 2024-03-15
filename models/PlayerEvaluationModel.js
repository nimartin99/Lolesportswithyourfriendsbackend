const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    player: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    kills: {
        required: true,
        type: Number,
    },
    deaths: {
        required: true,
        type: Number,
    },
    assists: {
        required: true,
        type: Number,
    },
    killParticipation: {
        required: true,
        type: Number,
    },
    championDamageShare: {
        required: true,
        type: Number,
    },
    championId: {
        required: true,
        type: String,
    },
    level: {
        required: true,
        type: Number,
    },
    totalGoldEarned: {
        required: true,
        type: Number,
    },
    creepScore: {
        required: true,
        type: Number,
    },
    attackDamage: {
        required: true,
        type: Number,
    },
    criticalChance: {
        required: true,
        type: Number,
    },
    attackSpeed: {
        required: true,
        type: Number,
    },
    abilityPower: {
        required: true,
        type: Number,
    },
    armor: {
        required: true,
        type: Number,
    },
    magicResistance: {
        required: true,
        type: Number,
    },
    tenacity: {
        required: true,
        type: Number,
    },
    lifeSteal: {
        required: true,
        type: Number,
    },
    wardsPlaced: {
        required: true,
        type: Number,
    },
    wardsDestroyed: {
        required: true,
        type: Number,
    },

    // Custom stuff
    basePoints: {
        required: true,
        type: Number,
    }
})

module.exports = mongoose.model('PlayerEvaluation', dataSchema)