const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const stripe = require("stripe")(process.env.VITE_STRIPE_KEY);

const app = express();

app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    Message: "success!",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (total > 0) {
    const paymentIntents = await stripe.paymentIntents.create({
      amount: total,
      currency: "USD",
    });

    res.status(201).json({
      clientSecret: paymentIntents.client_secret,
    });
  } else {
    res.status(403).json({
      massege: "Total is less than 0",
    });
  }
});

app.listen(6000, (err) => {
  if (err) throw err;
  console.log("Server Running on PORT: http://localhost:6000");
});
