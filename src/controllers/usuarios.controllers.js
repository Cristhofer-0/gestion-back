import User from '../models/Usuario/Usuario.js';
import bcrypt from 'bcrypt';

export const getUsuarios = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

export const getUsuario = async (req, res) => {
    const userId = req.params.id;
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'UserId inválido' });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { Email: email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!passwordMatch) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const { PasswordHash, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

export const registerUsuario = async (req, res) => {
    try {
        const { Email, DNI, PasswordHash, ...userData } = req.body;
        
        // Validar si el Email ya existe
        const existingEmail = await User.findOne({ where: { Email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        // Validar si el DNI ya existe
        const existingDNI = await User.findOne({ where: { DNI } });
        if (existingDNI) {
            return res.status(400).json({ message: 'El DNI ya está registrado.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(PasswordHash, saltRounds);
    
        const user = await User.create({ ...userData, PasswordHash: hashedPassword });
    
        const { PasswordHash: _, ...userWithoutPassword } = user.toJSON(); // excluye la contraseña
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

export const updateUsuario = async (req, res) => {
    const userId = req.params.id;

    try {
        const [updatedRows] = await User.update(req.body, {
            where: { UserId: userId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o sin cambios' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

export const deleteUsuario = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedRows = await User.destroy({
            where: { UserId: userId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};