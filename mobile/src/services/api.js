import Axios from 'axios';

const api = Axios.create({
    baseURL: 'http://192.168.0.39:9898'
});

export default api;