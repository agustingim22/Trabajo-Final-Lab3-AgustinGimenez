import axios from "axios";

const apiAxios = axios.create({
  baseURL: 'https://laboratorio-36cf.restdb.io/rest/',
  headers: {'x-apikey': '64a5ccf686d8c5d256ed8fce'}
});

export default apiAxios;