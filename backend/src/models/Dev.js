const mongoose = require('mongoose');
const PointSchema = require('./utils/PointSchema');

// Estrutura do dev dentro do banco de dados
const DevSchema = new mongoose.Schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    location: {
        type: PointSchema,
        index: '2dsphere',
    },
    techs: [String],
});

module.exports = mongoose.model('Dev', DevSchema)