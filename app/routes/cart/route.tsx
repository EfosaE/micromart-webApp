import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getCartInfo } from "~/services/session.server";
import { CartItem, isErrorResponse, isSuccessResponse, Product } from "~/types";
import CartDiv from "./CartDiv";
import CartSummary from "./CartSummary";
import { getProductById } from "~/services/api/product.api";

export let handle = {
  breadcrumb: () => "Cart",
};
export async function loader({ request }: LoaderFunctionArgs) {
  const cart: CartItem[] = await getCartInfo(request);
  console.log(cart)
  if (!cart) {
    return {
      cart: [],
    };
  }
  const products = await Promise.all(
    cart.map(async (item) => {
      const response = await getProductById(item.id);

      if (isErrorResponse(response)) {
        return {
          id: item.id,
          error: true,
          message: "Failed to get product",
        };
      }

      if (isSuccessResponse(response)) {
        return {
          ...response.data, // full product data
          id: item.id,
          cartQuantity: item.cartQuantity,
          error: false,
        };
      }

      // Fallback case (optional)
      return {
        id: item.id,
        error: true,
        message: "Unexpected response",
      };
    })
  );

  // Separated into valid products and errors
  const validProducts = products.filter((item) => !item.error);
  const errors = products.filter((item) => item.error);

  return {
    cart: validProducts,
    error: errors.length > 0 ? errors[0].message : undefined,
  };
}

type LoaderData = {
  cart: CartItem[];
  error?: string;
};
const Cart = () => {
  const { cart, error } = useLoaderData<LoaderData>();
  if (error) {
    return <div className="container">{error}</div>;
  }

  return (
    <main className="container">
      <h1 className="text-2xl font-bold mb-4 text-secondary">Shopping Cart</h1>
      <div className="flex gap-6 my-4 ">
        <CartDiv cart={cart} />
        <CartSummary cart={cart} />
      </div>
    </main>
  );
};

export default Cart;
