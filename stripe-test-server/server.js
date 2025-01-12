const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Stripe Secret Key (test)
const stripe = require("stripe")("sk_test_51Qf351CrcAaK1Q33mlnRRMU3Pzkse8mBEvysjvNVzf40ddDc9t9PFP6KH3TX871vHyA99BBfdKAYfvlrXXTwskXG00SqGg3wpU");

// (test) localhost:4242
const PORT = 4242;

/**
 * [POST] /create-payment-intent
 * body: { amount: number, currency: string }
 */
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Ensure the amount is an integer and currency is valid
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount. Must be a positive integer." });
    }
    if (!currency || currency.toLowerCase() !== "vnd") {
      return res.status(400).json({ error: "Invalid or unsupported currency. Must be 'vnd'." });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in VND (integer, no decimals)
      currency: currency.toLowerCase(), // "vnd"
      automatic_payment_methods: { enabled: true }, // Enable default payment methods
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
