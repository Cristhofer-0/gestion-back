import stripe from '../config/stripe.js'
import jwt from 'jsonwebtoken'
import Order from '../models/Order/Order.js';
import Ticket from '../models/Ticket/Ticket.js';
import Event from '../models/Eventos/Evento.js';

//MODELO DE PRUEBAS
export const createSession =  async  (req, res) =>{
  const session = await stripe.checkout.sessions.create({
    line_items:[
      {
        price_data: {
          product_data: {
            name: 'Laptop',
            description: 'Es una laptop'
          },
          currency: 'pen',
          unit_amount: 200000 //2000.00
        },
        quantity: 1
      },
      {
        price_data: {
          product_data: {
            name: 'Teleguision',
            description: 'Es una television 78k 10000FPS'
          },
          currency: 'pen',
          unit_amount: 20000 //200.00
        },
        quantity: 3

      }

    ],

    mode:'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel'
  })

  return res.json(session)
  //AL DARLE CLICK AL LINK EN EL ULTIMO DATO Y ABRIRLO SE ABRE LA PESTAÑA PARA REALIZAR EL PAGO
}

export const createSessionFromPendingOrders = async (req, res) => {
  try {
    // 🔐 Verifica y decodifica el token
    const token = req.cookies?.tokenUsuario;
    if (!token) {
      return res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    const userId = decoded.userId;

    // 🔎 Buscar órdenes pendientes con relaciones
    const pendingOrders = await Order.findAll({
      where: {
        UserId: userId,
        PaymentStatus: 'pending'
      },
      include: [
        {
          model: Event,
          attributes: ['Title']
        },
        {
          model: Ticket,
          attributes: ['Price']
        }
      ]
    });

    if (!pendingOrders.length) {
      return res.status(400).json({ message: 'No hay órdenes pendientes.' });
    }

    // 💳 Crear line_items dinámicamente
    const line_items = pendingOrders.map(order => ({
      price_data: {
        currency: 'pen',
        unit_amount: Math.round(parseFloat(order.Ticket.Price) * 100), // a centavos
        product_data: {
          name: `Entrada: ${order.Event.Title}`,
          description: `Ticket ID: ${order.TicketId}`,
        }
      },
      quantity: order.Quantity
    }));

    // 🧾 Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });

    return res.json(session);

  } catch (error) {
    console.error('Error al crear la sesión de Stripe:', error);
    return res.status(500).json({ message: 'Error al crear la sesión de pago.' });
  }
};

export const ordenPagada = async(req,res) =>{
  try {
    // 🔐 Verifica y decodifica el token para obtener el UserId
    const token = req.cookies?.tokenUsuario;
    if (!token) {
      return res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    const userId = decoded.userId;

    // 🔎 Busca las órdenes pendientes del usuario
    const orders = await Order.findAll({
      where: { UserId: userId, PaymentStatus: 'pending' }
    });

    // 🔄 Actualiza a 'paid'
    await Promise.all(
      orders.map(order => order.update({ PaymentStatus: 'paid' }))
    );

    console.log(`Órdenes de ${userId} actualizadas a "paid".`);
    // 🔁 Redirige a la página final de éxito (en Next.js)
    return res.redirect("http://localhost:3001/carrito?status=paid");
  } catch (err) {
    console.error('Error al actualizar el estado de pago:', err);
    return res.status(500).json({ message: 'Error al actualizar el estado de pago.' });
  }
};


