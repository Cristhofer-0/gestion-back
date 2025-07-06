import nodemailer from "nodemailer";

export const enviarAyuda = async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
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
      subject: "Consulta de Ayuda",
      html: `
        <div style="background-color: #0e0e0e; color: #f0f0f0; font-family: 'Segoe UI', sans-serif; padding: 2rem; border-radius: 8px;">
          <h2 style="color: #38bdf8; margin-bottom: 1rem;">💬 Nueva Consulta de Ayuda</h2>
          <p style="margin-bottom: 1rem;">Un usuario ha enviado una consulta desde el formulario de soporte:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 2rem;">
            <tbody>
              <tr>
                <td style="padding: 0.75rem; border: 1px solid #333; font-weight: bold;">🙍‍♂️ Nombre</td>
                <td style="padding: 0.75rem; border: 1px solid #333;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; border: 1px solid #333; font-weight: bold;">📧 Email</td>
                <td style="padding: 0.75rem; border: 1px solid #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; border: 1px solid #333; font-weight: bold;">📝 Asunto</td>
                <td style="padding: 0.75rem; border: 1px solid #333;">${asunto}</td>
              </tr>
              <tr>
                <td style="padding: 0.75rem; border: 1px solid #333; font-weight: bold;">💡 Mensaje</td>
                <td style="padding: 0.75rem; border: 1px solid #333;">${mensaje}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size: 0.9rem; color: #aaa;">Este correo fue generado automáticamente por <strong style="color: #38bdf8;">Join With Us</strong>.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Correo enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ message: "Error al enviar el correo." });
  }
}