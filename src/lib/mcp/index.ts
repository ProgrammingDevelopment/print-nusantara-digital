import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listCart from "./tools/list-cart";
import addToCart from "./tools/add-to-cart";
import listOrders from "./tools/list-orders";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "elka-printing",
  title: "elka-printing",
  version: "0.1.0",
  instructions:
    "Tools for the Elka Grafika printing shop. Browse the product catalog, and for signed-in users read their cart and orders or add products to the cart.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, listCart, addToCart, listOrders],
});
