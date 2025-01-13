export function capitalizeWord(str: string) {
  console.log(str)
  return str
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
}
