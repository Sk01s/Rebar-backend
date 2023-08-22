const express = require("express");
const Stripe = require("stripe");
const bod = require("body-parser");
const { json } = bod;
const router = express.Router();
const stripe = Stripe(process.env.REACT_APP_STRIPE_API_KEY);

router.use(json());

router.post("/", async (req, res) => {
  const customerId = req.body.userId;
  console.log(customerId);
  const ans = await stripe.customers.create({
    id: customerId,
  });
  res.json({ id: ans.id });
});
module.exports = router;
