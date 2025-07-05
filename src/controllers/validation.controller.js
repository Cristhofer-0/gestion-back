// controllers/validation.controller.js
import axios from 'axios';

export const verificarDNI = async (req, res) => {
  const { numero } = req.body;

  if (!numero || !/^\d{8}$/.test(numero)) {
    return res.status(400).json({ error: 'DNI inválido. Debe tener 8 dígitos.' });
  }

  try {
    const response = await axios.get('https://api.apis.net.pe/v2/reniec/dni', {
      params: { numero },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.APIS_TOKEN}`,
      },
    });

    res.json({ existe: true, datos: response.data });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ existe: false, mensaje: 'DNI no encontrado.' });
    }

    console.error('Error al consultar la API externa:', error.message);
    res.status(500).json({ error: 'Error al consultar la API externa.' });
  }
};
