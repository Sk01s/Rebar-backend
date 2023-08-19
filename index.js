import dotenv from "dotenv";
import { sendMail } from "./src/sendEmail.js";
import express, { json } from "express";
import cors from "cors";
import webhook from "./src/routes/webhook.js";
import checkout from "./src/routes/createCheckoutSession.js";
import customer from "./src/routes/createCustomer.js";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://rebar-shop.vercel.app", "http://127.0.0.1:5173"],
  })
);

app.use("/webhook", webhook);
app.use("/payment/create-checkout-session", checkout);
app.use("/payment/create-customer", customer);

// sendMail("youssef", "alsarakibiy@gmail.com");

app.listen(process.env.PORT || 5500, () =>
  console.log(process.env.PORT || 5500)
);
