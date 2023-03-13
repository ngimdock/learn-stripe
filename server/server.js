import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(express.static("public"));
const port = process.env.SERVER_PORT | 8000;

console.log(`${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  ["1", { priceInCents: 1000, name: "T-shirt" }],
  ["2", { priceInCents: 2000, name: "Pants" }],
  ["3", { priceInCents: 3000, name: "Shoes" }],
]);

app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items;

  const lineItems = items.map(({ id, quantity }) => {
    const storeItem = storeItems.get(id);

    console.log({ storeItem });

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
      success_url: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/success.html`,
      cancel_url: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
