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
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2c3e50;">Nueva Solicitud de Cambio de Rol</h2>
          <p>Has recibido una nueva solicitud con los siguientes datos:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">DNI:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${dni}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nombre:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Teléfono:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${telefono}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Razón:</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${razon}</td>
              </tr>
            </tbody>
          </table>
          <p style="margin-top: 20px; font-style: italic; color: #555;">
            Este correo fue generado automáticamente por Joint With Us.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar el correo." });
  }
};
