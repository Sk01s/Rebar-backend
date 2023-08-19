import express, { json } from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import { verfiyOrder } from "../firebase-config.js";
dotenv.config();
const router = express.Router();
const stripe = Stripe(process.env.REACT_APP_STRIPE_API_KEY);

router.use(
  json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

router.use(
  cors({
    origin: ["https://rebar-shop.vercel.app", "http://127.0.0.1:5173"],
  })
);

router.use(
  cors({
    origin: ["https://rebar-shop.vercel.app", "http://127.0.0.1:5173"],
  })
);
router.post("/", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret =
    process.env.END_POINT ||
    "whsec_57519f22485863fc77f77565085b382bd098831cca85bfa87d070d1b7f2b8432";
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req["rawBody"],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }
  console.log(data.object);
  switch (eventType) {
    case "checkout.session.completed":
      const answer = await verfiyOrder(data.object.id);
      break;
    case "payment_intent.succeeded":
      break;
    case "invoice.payment_failed":
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
});

export default router;
