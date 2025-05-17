import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  // El token normalmente se envía en el header Authorization como: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // toma solo el token

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, token faltante' });
  }

  try {
    // Verifica y decodifica el token con la clave secreta
    const secretKey = process.env.JWT_SECRET || 'password_jwu_jwt';
    const user = jwt.verify(token, secretKey);

    // Guardamos el usuario decodificado en req.user para usarlo en rutas protegidas
    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
