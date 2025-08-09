import catchAsync from "~/utils/catchAsync";
import { axiosAuthWrapper, axiosInstance } from "./axios.server";
import {
  isErrorResponse,
  isSuccessResponse,
  Product,
  SuccessResponse,
} from "~/types";
import { Category } from "~/components/Categories";
import {
  getCategoriesFromCache,
  getProductsFromCache,
  setCategoriesInCache,
  setProductsInCache,
} from "~/utils/cache";
import { RedisClientType } from "redis";

export const createProduct = catchAsync<
  SuccessResponse,
  [string, FormData, Record<string, string>]
>(
  async (
    accessToken: string,
    formData: FormData,
    customHeaders: Record<string, string>
  ): Promise<SuccessResponse> => {
    const response = await axiosAuthWrapper(
      accessToken,
      "/api/v1/products/",
      "POST",
      formData,
      customHeaders // Passing custom headers here
    );
    console.log(response);

    return {
      success: true,
      data: response.data,
    };
  }
);
export const fetchProductsFromBE = catchAsync<SuccessResponse, [string]>(
  async (category: string): Promise<SuccessResponse> => {
    const response = await axiosInstance.get(
      `/api/v1/products?limit=40&tags=${category}`
    );

    return {
      success: true,
      data: response.data,
    };
  }
);
export const getProducts = async (
  category: string
): Promise<Product[] | null> => {
  // Try to get categories from the cache
  let products = getProductsFromCache(category);

  // console.log('from cache', products);
  // If categories are not in the cache, fetch them
  if (!products) {
    const response = await fetchProductsFromBE(category);
    // Check if the response is successful and store in cache
    if (isSuccessResponse(response)) {
      setProductsInCache(category, response.data.products);
      products = response.data.products;
    }

    // If the response is an error, return null
    if (isErrorResponse(response)) {
      return null;
    }
  }
  if (products) return products;

  return null;
};

export const fetchCategories = catchAsync<SuccessResponse, []>(
  async (): Promise<SuccessResponse> => {
    const response = await axiosInstance.get("/api/v1/products/list/categories");

    return {
      success: true,
      data: response.data,
    };
  }
);

export async function getCategories(): Promise<Category[] | null> {
  // Try to get categories from the cache
  let categories = getCategoriesFromCache();

  // If categories are not in the cache, fetch them
  if (!categories) {
    const response = await fetchCategories();

    // Check if the response is successful and store in cache
    if (isSuccessResponse(response)) {
      categories = response.data;
      setCategoriesInCache(response.data);
    }

    // If the response is an error, return null
    if (isErrorResponse(response)) {
      return null;
    }
  }
  if (categories) return categories;

  return null;
}

export const fetchTags = catchAsync<SuccessResponse, [RedisClientType | null]>(
  async (client: RedisClientType | null): Promise<SuccessResponse> => {
    let data;

    if (!client) {
      // Redis client is null → go straight to API
      console.log("Redis client is null, fetching from API");
      const response = await axiosInstance.get("/api/v1/products/list/tags");
      data = response.data;
    } else {
      // Try getting from Redis
      data = await client.json.get("products:tags");
      console.log("Fetched data from Redis");

      if (!data) {
        console.log("No data in Redis, fetching from API");
        const response = await axiosInstance.get("/api/v1/products/list/tags");
        await client.json.set("products:tags", "$", response.data);
        data = response.data;
      }
    }

    return {
      success: true,
      data,
    };
  }
);


export const fetchProducts = catchAsync<SuccessResponse, [RedisClientType | null]>(
  async (client: RedisClientType | null): Promise<SuccessResponse> => {
    let data;

    if (client) {
      try {
        data = await client.json.get("products:homepage");
        if (data) {
          console.log("Data gotten from Redis");
        }
      } catch (err) {
        console.error("Redis read error:", err);
      }
    }

    // If no Redis or no cached data, fetch fresh from API
    if (!data) {
      console.log("Fetching products from API...");
      const [phoneResponse, computerResponse, applianceResponse] = await Promise.all([
        axiosInstance.get("/api/v1/products?limit=4&tags=phones"),
        axiosInstance.get("/api/v1/products?limit=4&tags=computers"),
        axiosInstance.get("/api/v1/products?limit=4&tags=appliances"),
      ]);

      data = {
        phones: phoneResponse.data.products,
        computers: computerResponse.data.products,
        appliances: applianceResponse.data.products,
      };

      console.log("homepage", data)

      if (client !== null) {
        try {
          await client.json.set("products:homepage", "$", data);
          const result = await client.expire("products:homepage", 864000); // 10 days
          console.log("Cached products in Redis, expire result:", result);
        } catch (err) {
          console.error("Redis write error:", err);
        }
      }
    }

    return {
      success: true,
      data,
    };
  }
);


export const getProductById = catchAsync<SuccessResponse, [string]> (async (id: string): Promise<SuccessResponse> => {
  const response = await axiosInstance.get(`/api/v1/products/${id}`);
  return {
    success: true,
    data: response.data,
  };
});
