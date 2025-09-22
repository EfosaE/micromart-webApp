import { useFetcher } from "react-router";
import { useEffect } from "react";
import { Button } from "~/components/Button";
import { CartItem } from "~/types";

const CartSummary = ({ cart }: { cart: CartItem[] }) => {
  const fetcher = useFetcher();

  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.cartQuantity * item.price,
    0
  );

  function handlePay() {
    fetcher.submit(
      {
        amount: String(subtotal), // send subtotal as string
        // callback_url: `${window.location.origin}/payments/callback`
      },
      { method: "post", action: "/api/payments/init" }
    );
  }

  console.log("from fetcher", fetcher.data);

  // Handle redirect in useEffect with better error handling
useEffect(() => {
    // console.log("useEffect triggered - state:", fetcher.state, "data:", fetcher.data);
    
    // Only proceed if we have fetcher.data and it has a data property
    if (!fetcher.data?.data?.data) {
      // console.log("No nested data yet");
      return;
    }
    
    const authUrl = fetcher.data.data.data.authorization_url;
    const isNotSubmitting = fetcher.state !== "submitting";
    
    console.log("authUrl:", authUrl, "isNotSubmitting:", isNotSubmitting);
    
    if (authUrl && isNotSubmitting) {
      console.log("Redirecting to:", authUrl);
      try {
        window.location.href = authUrl;
      } catch (error) {
        console.error("Redirect failed:", error);
        // Fallback: open in new tab
        window.open(authUrl, '_self');
      }
    }
  }, [fetcher.state, fetcher.data?.data?.data]); // Track when the nested data object changes

  return (
    <div className="w-1/4 p-2 bg-white h-fit">
      <p className="text-gray-700 font-semibold py-2 border-b border-slate-300">
        Order Summary
      </p>
      <div className="flex justify-between py-2.5 border-b border-slate-300">
        <p>Subtotal</p>
        <p className="font-semibold">₦ {subtotal}</p>
      </div>
      <Button
        onClick={handlePay}
        disabled={fetcher.state !== "idle"}
        label={
          fetcher.state === "submitting"
            ? "Redirecting..."
            : "Pay with Paystack"
        }
        styles={["my-1", "rounded-sm", "w-full"]}
      />
    </div>
  );
};

export default CartSummary;