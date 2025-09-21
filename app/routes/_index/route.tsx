import { Await, Link, useLoaderData, useMatches } from "react-router";
import { Suspense, useEffect } from "react";
import { RedisClientType } from "redis";
import Appliances from "~/components/CategoriesUi/Appliances";
import Computers from "~/components/CategoriesUi/Computers";
import Phones from "~/components/CategoriesUi/Phones";
import Hero from "~/components/Hero";
import { fetchProducts } from "~/services/api/product.api";
import { getRedisClient, initializeRedis } from "~/services/redis.server";
import { isErrorResponse, isSuccessResponse, Product } from "~/types";

type ProductData = {
  phones?: Product[];
  computers?: Product[];
  appliances?: Product[];
  error?: string;
};

type LoaderData = {
  productsPromise: Promise<{
    phones?: Product[];
    computers?: Product[];
    appliances?: Product[];
    error?: string;
  }>;
};

// Separate async function to handle the product fetching
async function loadProductsFromApi(client: RedisClientType | null) {
  const response = await fetchProducts(client);

  if (isSuccessResponse(response)) {
    return response.data;
  }

  if (isErrorResponse(response)) {
    return { error: "Failed to load products" };
  }

  return { error: "Unknown error occurred" };
}

// export async function loader() {
//   try {
//     const client = await initializeRedis();

//     if (!client) {
//       const productsPromise = loadProductsFromApi(client);

//       return { productsPromise };
//     }
//     const productsPromise = loadProductsFromApi(client);

//     return { productsPromise };
//   } catch (err) {
//     console.error("Homepage loader error:", err);
//     // Pass error message to UI instead of hanging
//     return { error: "Could not connect to Redis. Please try again later." };

//     // If you prefer to use the root ErrorBoundary:
//     // throw new Response('Could not connect to Redis', { status: 500 });
//   }
// }

export async function loader() {
  console.log("🏠 Homepage loader started");

  try {
    // CRITICAL FIX: Use getRedisClient instead of initializeRedis
    // getRedisClient has better error handling and won't crash Vercel
    console.log("🔄 Getting Redis client safely...");

    const client = await getRedisClient(); // This is the safe version

    console.log("🔄 Redis client result:", client ? "CONNECTED" : "NULL");

    // Always pass the client (even if null) to loadProductsFromApi
    // Your fetchProducts function already handles null clients gracefully
    const productsPromise = loadProductsFromApi(client);

    console.log("✅ Homepage loader returning products promise");
    return { productsPromise };
  } catch (err) {
    console.error("❌ Homepage loader error:", err);

    // Create a promise that resolves to an error state
    // This prevents the loader from throwing and crashing Vercel
    const errorPromise = Promise.resolve({
      error: "Could not load products. Please try refreshing the page.",
    });

    return { productsPromise: errorPromise };
  }
}

// Loading component for better UX
function ProductsLoading() {
  return (
    <div className="flex flex-col space-y-14 mt-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Component to render products once loaded
function ProductsContent({
  productsData,
}: {
  productsData: {
    phones?: Product[];
    computers?: Product[];
    appliances?: Product[];
    error?: string;
  };
}) {
  const { phones, computers, appliances, error } = productsData;
  console.log(error);
  if (error) {
    return (
      <div className="mt-8">
        <p className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-14 mt-8">
      <Phones phones={phones} error={error} />
      <Computers computers={computers} error={error} />
      <Appliances appliances={appliances} error={error} />
    </div>
  );
}

export default function Index() {
  const { productsPromise } = useLoaderData<LoaderData>();
  const matches = useMatches();

  const layoutData = matches.find((match) => match.id === "routes/_globalayout")
    ?.data as {
    user?: { id: string; name: string };
  };

  const user = layoutData?.user;

  return (
    <div className="container">
      <Hero />

      {/* The page renders immediately with Hero, then products load asynchronously */}
      <Suspense fallback={<ProductsLoading />}>
        <Await resolve={productsPromise as unknown as ProductData}>
          {(productsData) => <ProductsContent productsData={productsData} />}
        </Await>
      </Suspense>
    </div>
  );
}
