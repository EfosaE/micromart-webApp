type User = {
    id: string,
    name: string,
}


// type guard
export function isUser(data: any): data is User {
  return (
    typeof data === 'object' && data !== null && 'id' in data && 'name' in data
  );
}