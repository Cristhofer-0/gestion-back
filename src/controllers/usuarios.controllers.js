import User from '../models/Usuario/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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

        const hashedPassword = user.PasswordHash;

        let passwordMatch = false;

        // Verifica si la contraseña está hasheada (bcrypt hashes typically start with $2)
        if (hashedPassword.startsWith('$2')) {
            passwordMatch = await bcrypt.compare(password, hashedPassword);
        } else {
            // Contraseña en texto plano (caso antiguo o mal guardado)
            passwordMatch = password === hashedPassword;
        }

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
    
        const user = await User.create({
            ...userData,
            Email,
            DNI,
            PasswordHash: hashedPassword
        });
    
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
        const updateData = { ...req.body };

        // Verificar si se está actualizando la contraseña
        if (updateData.PasswordHash) {
            const looksHashed = typeof updateData.PasswordHash === 'string' &&
                                updateData.PasswordHash.startsWith('$2b$');

            if (!looksHashed) {
                const saltRounds = 10;
                updateData.PasswordHash = await bcrypt.hash(updateData.PasswordHash, saltRounds);
            }
        }

        const [updatedRows] = await User.update(updateData, {
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