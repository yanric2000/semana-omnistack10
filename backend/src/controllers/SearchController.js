// Mongo trabalha na seguinte ordem: longitude, latitude

const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response){
        // Buscar todos os devs em um raio de 10km
        // filtrando pelas suas tecnologias

        const {longitude, latitude, techs} = request.query;
        const techsArray = parseStringAsArray(techs);

        // $in -> Operador logico do mongodb que vai checar os usuarios que
        // tem uma tecnologia dentro do array que foi passado
        const devs = await Dev.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [ longitude, latitude ],
                    },
                    $maxDistance: 10000,
                },
            }
        });  

        return response.json({ devs });
    }
}