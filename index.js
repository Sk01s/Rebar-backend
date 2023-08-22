const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const webhook = require("./src/routes/webhook.js");
const checkout = require("./src/routes/createCheckoutSession.js");
const customer = require("./src/routes/createCustomer.js");
dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://rebar-shop.vercel.app", "http://localhost:5173"],
  })
);

app.use("/webhook", webhook);
app.use("/payment/create-checkout-session", checkout);
app.use("/payment/create-customer", customer);
app.get("/", (req, res) => {
  res.json(req.body);
});
// sendMail("youssef", "alsarakibiy@gmail.com");

app.listen(process.env.PORT || 5500, () =>
  console.log(process.env.PORT || 5500)
);
