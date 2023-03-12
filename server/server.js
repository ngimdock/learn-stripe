import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
const port = 8000;

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  ["1", { priceInCents: 1000, name: "T-shirt" }],
  ["2", { priceInCents: 2000, name: "Pants" }],
  ["3", { priceInCents: 3000, name: "Shoes" }],
]);

console.log({ stripeKey: process.env.STRIPE_PRIVATE_KEY });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
