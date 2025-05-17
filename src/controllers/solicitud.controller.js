import nodemailer from "nodemailer";

export const enviarSolicitud = async (req, res) => {
  const { dni, nombre, email, telefono, razon } = req.body;

  if (!dni || !nombre || !email || !telefono || !razon) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "sebaslade29@gmail.com",
      subject: "Nueva Solicitud de Cambio de Rol",
      text: `
        DNI: ${dni}
        Nombre: ${nombre}
        Email: ${email}
        Teléfono: ${telefono}
        Razón: ${razon}
      `.trim(),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar el correo." });
  }
};
