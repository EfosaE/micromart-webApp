/**
 * Utility function to encode URLs and create slugs.
 */
export const urlUtils = {
  // Encode a string for use in a URL (percent encoding)
  encodeUrl: (str: string) => {
    return encodeURIComponent(str);
  },

  // Create a slug from a string (lowercase, spaces replaced with hyphens, non-alphanumeric characters removed)
  createSlug: (str: string) => {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing spaces
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-+/, '') // Remove leading hyphen
      .replace(/-+$/, ''); // Remove trailing hyphen
  },
};

// Example usage:
const categoryName = 'Phones & Accessories';

const encodedUrl = urlUtils.encodeUrl(categoryName);
const slug = urlUtils.createSlug(categoryName); 

console.log('Encoded URL:', encodedUrl); // Phones%20%26%20Accessories
console.log('Slug:', slug); // phones-and-accessories
