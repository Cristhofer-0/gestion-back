import Stripe from 'stripe'

//console.log("STRIPE SECRET KEY:", process.env.STRIPE_SECRET_KEY); 
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default stripe;
