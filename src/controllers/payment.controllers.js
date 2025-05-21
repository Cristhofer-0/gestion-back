import stripe from '../config/stripe.js'
import jwt from 'jsonwebtoken'
import Order from '../models/Order/Order.js';
import Ticket from '../models/Ticket/Ticket.js';
import Event from '../models/Eventos/Evento.js';

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
          description: `Ticket ID: ${order.TicketId}`
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




export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'pen',
      payment_method_types: ['card'],
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export const payWithCardData = async (req, res) => {
  try {
    const { card, amount } = req.body
    // card: { number, exp_month, exp_year, cvc }

    // 1. Crear método de pago con los datos de la tarjeta
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });

    // 2. Crear y confirmar el pago
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // el monto debe estar en centavos
      currency: 'pen',
      payment_method: paymentMethod.id,
      confirm: true,
    });

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const createPayment = async (payment_method_id) => {
  try {
    const payment = await stripe.paymentIntents.create({
      amount: 5 * 100,
      currency: 'pen',
      payment_method: payment_method_id,
      confirm: true
    });
    console.log("Pago con ID " + payment.id + " realizado correctamente");
    return payment;
  } catch (error) {
    console.error("Error al realizar el pago:", error.message);
    throw error;
  }
}


