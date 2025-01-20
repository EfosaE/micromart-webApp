import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { axiosInstance } from "~/services/api/axios.server";



export const loader = async () => redirect(`${process.env.NEST_API_URL}/api/v1/auth/google`);

