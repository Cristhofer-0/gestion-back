import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import cloudinary from '../config/cloudinary.js';

export const uploadImage = (req, res) => {
  console.log('Llamando a uploadImage');

  const form = formidable({ multiples: false });

form.parse(req, async (err, fields, files) => {
  if (err) {
    console.error('Error al procesar el archivo:', err);
    return res.status(400).json({ error: 'Error al procesar el archivo' });
  }

  // Agrega este log
  console.log('Contenido de files:', JSON.stringify(files, null, 2));

  try {
    const file = files?.file?.[0]; 
    if (!file) {
      console.error('Archivo no recibido o malformado');
      return res.status(400).json({ error: 'Archivo no recibido o malformado' });
    }

    const filePath = file.filepath || file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: uuidv4(),
    });

    console.log('Imagen subida:', result.secure_url);

    return res.status(200).json({ url: result.secure_url });
  } catch (uploadErr) {
    console.error('Error al subir la imagen:', uploadErr);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
})}
