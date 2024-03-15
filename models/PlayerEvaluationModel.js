const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const dataSchema = new mongoose.Schema({
    player: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    // Custom stuff
    basePoints: {
        required: true,
        type: Number,
    },
    // General stats
    kills: {
        type: Number,
    },
    deaths: {
        type: Number,
    },
    assists: {
        type: Number,
    },
    killParticipation: {
        type: Number,
    },
    championDamageShare: {
        type: Number,
    },
    championId: {
        type: String,
    },
    level: {
        type: Number,
    },
    totalGoldEarned: {
        type: Number,
    },
    creepScore: {
        type: Number,
    },
    attackDamage: {
        type: Number,
    },
    criticalChance: {
        type: Number,
    },
    attackSpeed: {
        type: Number,
    },
    abilityPower: {
        type: Number,
    },
    armor: {
        type: Number,
    },
    magicResistance: {
        type: Number,
    },
    tenacity: {
        type: Number,
    },
    lifeSteal: {
        type: Number,
    },
    wardsPlaced: {
        type: Number,
    },
    wardsDestroyed: {
        type: Number,
    },
})

module.exports = mongoose.model('PlayerEvaluation', dataSchema)