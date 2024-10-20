import axios from 'axios';

const baseURL = 'https://criptoya.com/api/satoshitango/';

export async function getCryptoValues(cryptoCode) {
  try {
    const resp = await axios.get(`${baseURL}${cryptoCode}/ars`);
    return resp.data;
  } catch (error) {
    console.error(error, '- Error al obtener detalles de la Api');
    throw error;
  }
}
