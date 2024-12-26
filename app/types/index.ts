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



export function isErrorResponse(data: any): data is ErrorResponse {
  return (
    typeof data === 'object' && 
    data !== null && 
    'success' in data && 
    data.success === false &&
    'error' in data &&
    'statusCode' in data &&
    typeof data.error === 'string' &&
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



