import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyTokenUsuario = (req, res, next) => {
    const token = req.cookies?.tokenUsuario;

    if (!token) {
        return res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Ahora puedes acceder a `req.user.userId`, etc.
        next(); // Permite que la solicitud continúe
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};
