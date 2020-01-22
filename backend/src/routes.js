const { Router } = require('express');

const routes = Router();

const devController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

// Query Params -> Usado para paginação, filtros, pesquisa(?nome=yan)
// Route Params -> Fica na url como users/yan
// Body Params -> Fica no corpo da requisição(POST)

routes.get('/', (request, response) => {
    return response.json({message: 'Hello'});
});

routes.post('/devs', devController.store);
routes.delete('/dev', devController.destroy)
routes.get('/devs', devController.index);
routes.put('/dev', devController.update);

routes.get('/search', SearchController.index);

module.exports = routes;