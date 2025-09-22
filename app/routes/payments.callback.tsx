// app/routes/payments.callback.tsx
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { axiosInstance } from "~/services/api/axios.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return { status: "error", message: "No reference found" };
  }

  try {
    // ✅ Call NestJS backend
    const res = await axiosInstance.get(
      `${process.env.NEST_API_URL}/api/v1/payment/verify?reference=${reference}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Verification response:", res.data);
    // Only return serializable data
    return { status: "success", message: res.data.message };
  } catch (error: any) {
    console.error("Verification error:", error?.message);
    return { status: "error", message: "Verification failed" };
  }
}

export default function PaymentCallback() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Payment Status</h1>
      {data.status === "success" ? (
        <p>✅{data.message}</p>
      ) : data.status === "error" ? (
        <p>❌{data.message}</p>
      ) : (
        <p>⚠️ {data.message}</p>
      )}
    </div>
  );
}
