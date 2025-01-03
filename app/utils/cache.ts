import NodeCache from 'node-cache';
import { Category } from '~/components/Categories';

// Cache instance with 1-day TTL
const cache = new NodeCache({ stdTTL: 3600 * 24 });


// Utility to get and set categories
export function getCategoriesFromCache(): Category[] | undefined {
  return cache.get<Category[]>('categories');
}

export function setCategoriesInCache(categories: Category[]): void {
  cache.set('categories', categories);
}

// Clear cache if needed (e.g., after an update)
export function clearCategoriesCache(): void {
  cache.del('categories');
}
