import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.model.js"
dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY);
let cart;
let name;
let email;
let userId;

router.post("/create-checkout-session", async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId
    },
  });

  userId=req.body.userId;
  email=req.body.email;
  name=req.body.name;
  cart=req.body.cart;
  


  const line_items = req.body.cart.products.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: [product.img],
          description: product.desc,
          metadata: {
            id: product._id,
          },
        },
        unit_amount: product.price * 100,
      },
      quantity: product.quantity,
    };
  });
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/myorders`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// web hook
let endpointSecret;
// This is your Stripe CLI webhook secret for testing your endpoint locally.
//let endpointSecret = "whsec_f0afeb838a5a0ae9b1160016c9632978d6a16c6d1a0fb1a9d60c32f1151ae20b";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          endpointSecret
        );
        console.log("webhook verified ");
      } catch (err) {
        console.log("webhook error", err.message);
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then(async(customer) => {
          const newOrder =  Order({
            name,
            userId,
            products:cart.products,
            total:cart.total,
            email
          });
          await newOrder.save();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);



export default router;