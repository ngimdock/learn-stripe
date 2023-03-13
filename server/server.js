import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
// app.use(express.static("public"));
const port = process.env.SERVER_PORT | 3000;

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  ["1", { priceInCents: 100, name: "T-shirt" }],
  ["2", { priceInCents: 2000, name: "Pants" }],
  ["3", { priceInCents: 3000, name: "Shoes" }],
]);

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items;

  const lineItems = items.map(({ id, quantity }) => {
    const storeItem = storeItems.get(id);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: storeItem.name,
        },

        unit_amount: storeItem.priceInCents,
      },
      quantity: quantity,
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/client/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/client/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Example app listening `);
});
