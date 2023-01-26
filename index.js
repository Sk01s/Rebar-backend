require("dotenv").config();
const { getProductPrice } = require("./firebase-config");
const path = require("path");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_API_KEY);

// This is your test secret API key.
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const endpointSecret =
  process.env.END_POINT ||
  "whsec_57519f22485863fc77f77565085b382bd098831cca85bfa87d070d1b7f2b8432";

app.use(express.static(path.resolve(__dirname, "client", "build")));
app.use(
  cors({
    origin: ["https://rebar-shop.vercel.app", "http://127.0.0.1:5173"],
  })
);

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});
app.post("/webhook", (req, res) => {
  let event = req.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req["rawBody"],
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      console.log(req["rawBody"]);
      console.log(signature);
      console.log(endpointSecret);
      return res.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(req["rawBody"]);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});
app.post("/payment/create-customer", async (req, res) => {
  const customerId = req.body.userId;
  await stripe.customers.create({
    id: customerId,
  });
  res.json({ cool: "true" });
});
app.post("/payment/create-checkout-session", async (req, res) => {
  console.log(1);
  const products = await getProductPrice();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: req.body.items.map(({ id, quantity }) => {
      if (quantity < 1) return;
      const { name, priceInCent, images } = products[id];
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name,
            images: images,
          },
          unit_amount: priceInCent,
        },
        quantity,
      };
    }),
    customer: req.body.userId,
    success_url: `https://${process.env.YOUR_DOMAIN}?success=true`,
    cancel_url: `https://${process.env.YOUR_DOMAIN}?canceled=true`,
  });
  res.json({ url: session.url });
});

app.listen(process.env.PORT || 5500, () =>
  console.log(process.env.PORT || 5500)
);
