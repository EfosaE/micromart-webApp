export type User = {
  id: string;
  name: string;
};
export type UserWithAccessToken = {
  accessToken: string;
  user: User;
};
export type ErrorResponse = {
  success: false;
  error: string;
  statusCode: (typeof errorStatusCodes)[number];
};

export type SuccessResponse = {
  success: true;
  data: any;
};

// type guards
export function isUser(data: any): data is User {
  return (
    typeof data === 'object' && data !== null && 'id' in data && 'name' in data
  );
}
export function isUserWithAccessToken(
  value: any
): value is UserWithAccessToken {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.user === 'object' &&
    value.user !== null &&
    typeof value.user.id === 'string' &&
    typeof value.user.name === 'string' &&
    typeof value.accessToken === 'string'
  );
}

// export function isErrorResponse(data: any): data is ErrorResponse {
//   return (
//     typeof data === 'object' &&
//     data !== null &&
//     'success' in data &&
//     data.success === false &&
//     'error' in data &&
//     'statusCode' in data &&
//     typeof data.error === 'string' &&
//     typeof data.statusCode === 'number'
//   );
// }

// relaxed error shape
export function isErrorResponse(data: any): data is ErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false &&
    'error' in data &&
    typeof data.statusCode === 'number'
  );
}

export function isSuccessResponse(data: any): data is SuccessResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === true &&
    'data' in data
  );
}

// Helper function to generate a range of numbers (400-499)
const generateRange = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

// Generate all status codes from 400 to 499
const errorStatusCodes = generateRange(400, 500);

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

// optional types to remove the TS error, this is validated by Zod no fear
export type VendorFormObject = {
  name?: string;
  email?: string;
  password?: string;
  businessName?: string;
  categoryId?: string;
  categoryName?: string
};



export interface Tag {
  id: number;
  name: string;
}


export interface TagsData {
  GeneralProductTags: Tag[];
  AdminTags: Tag[];
  SeasonalTags: Tag[];
  CategoryBasedTags: Tag[];
  ConditionBasedTags: Tag[];
  PriceBasedTags: Tag[];
  UsageBasedTags: Tag[];
  DemographicTags: Tag[];
  MaterialQualityTags: Tag[];
  FunctionalTags: Tag[];
}
