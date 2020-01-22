// Axios é uma lib que faz requisições para outras API's
const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// 5 funcoes do controller -> index, show, store, update, destroy

module.exports = {

    async index(request, response){
        const devs = await Dev.find(); 

        return response.json(devs);
    },

    async update(request, response){
        const { github_username } = request.body;
        let dev = await Dev.findOne({ github_username }, (error) => {console.log(error)});
        
        if(dev){
            const { bio, avatar_url, longitude, latitude, techs } = request.body;
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            const techsArray = parseStringAsArray(techs);
            
            dev.bio = bio;
            dev.avatar_url = avatar_url;
            dev.techs = techsArray;
            dev.location = location;
            
            dev.save((error) => {
                console.log(error);
            });

            console.log('atualizou');
            
        }
        
        let confirmacao = await Dev.findOne({ github_username }, (error) => {console.log(error)});

        return response.json(dev);
    },

    async destroy(request, response){
        const { github_username } = request.body;
        let devToDelete = await Dev.findOne({ github_username }, (error) => {console.log(error)});
        
        if(devToDelete){
            Dev.findOneAndRemove({ github_username }, (error) => {
                console.log(error);
            });

            const deleted = true;

            devToDelete = {deleted};

            console.log('deletou');
        }

        return response.json(devToDelete);
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;
    
        let dev = await Dev.findOne({ github_username });

        // Se nao encntrar o dev no banco eu cadastro
        if(!dev){
            // Espero a API do Github
            const githubResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            // if ternario porque pode ter usuarios com name vazio
            const { name = login, avatar_url, bio } = githubResponse.data
            const techsArray = parseStringAsArray(techs);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
            
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            console.log('cadastrou');
        }
    
        return response.json(dev);
    }
}