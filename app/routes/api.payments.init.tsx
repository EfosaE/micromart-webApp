import { ActionFunctionArgs, redirect } from "react-router";
import { axiosAuthWrapper } from "~/services/api/axios.server";
import { getAccessToken } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    return redirect("/login?redirectTo=/cart");
  }
  const body = await request.formData();
  const email = body.get("email") as string;
  const amount = parseInt(body.get("amount") as string);

  // Forward to NestJS backend
  //   const response = await fetch(
  //     `${process.env.NEST_API_URL}api/v1/payments/initialize`,
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, amount }),
  //     }
  //   );
  const response = await axiosAuthWrapper(
    accessToken,
    `${process.env.NEST_API_URL}/api/v1/payment/initialize`,
    "POST",
    { amount }
  );
  console.log(response);
  return response;
}
