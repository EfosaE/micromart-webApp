export type User = {
  id: string;
  name: string;
};
export type UserWithAccessToken = {
  accessToken: string;
  user: User;
};

// type guard
export function isUser(data: any): data is User {
  return (
    typeof data === 'object' && data !== null && 'id' in data && 'name' in data
  );
}
