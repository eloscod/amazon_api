const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Stripe configuration
const stripe = require("stripe")(process.env.VITE_STRIPE_KEY);

const app = express();

// Middleware
app.use(cors({ origin: "https://shop.osam.dev", credentials: true }));
app.use(express.json()); // Important for handling JSON bodies

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    Message: "success!",
  });
});

// Stripe payment intent route
app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (total > 0) {
    try {
      const paymentIntents = await stripe.paymentIntents.create({
        amount: total,
        currency: "USD",
      });

      res.status(201).json({
        clientSecret: paymentIntents.client_secret,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

// Use the dynamic port assigned by cPanel or fallback to 6000
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on http://localhost:${PORT}`);
});
