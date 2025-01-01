export interface ProductTags {
  GeneralProductTags: string[];
  CategoryBasedTags: string[];
  ConditionBasedTags: string[];
  SeasonalTags: string[];
  PriceBasedTags: string[];
  UsageBasedTags: string[];
  DemographicTags: string[];
  MaterialQualityTags: string[];
  Others: string[];
}
export enum TagTypes {
  GeneralProductTags = 'GeneralProductTags',
  CategoryBasedTags = 'CategoryBasedTags',
  ConditionBasedTags = 'ConditionBasedTags',
  SeasonalTags = 'SeasonalTags',
  PriceBasedTags = 'PriceBasedTags',
  UsageBasedTags = 'UsageBasedTags',
  DemographicTags = 'DemographicTags',
  MaterialQualityTags = 'MaterialQualityTags',
  Others = 'Others',
}

export const productTags = {
  GeneralProductTags: [
    'New Arrival',
    'Best Seller',
    'Trending',
    'On Sale',
    'Limited Edition',
    'Exclusive',
    'Back in Stock',
    'Pre-order',
    'Clearance',
    'Bundle Offer',
  ],
  CategoryBasedTags: [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Beauty & Personal Care',
    'Sports & Outdoors',
    'Toys & Games',
    'Books',
    'Health & Wellness',
    'Groceries',
    'Automotive',
  ],
  ConditionBasedTags: [
    'New',
    'Refurbished',
    'Used',
    'Certified Pre-Owned',
    'Open Box',
    'Damaged',
  ],
  SeasonalTags: [
    'Holiday Special',
    'Winter Collection',
    'Summer Sale',
    'Back to School',
    'Valentine’s Day',
    'Black Friday',
    'Cyber Monday',
    'Christmas Gifts',
    'Easter Special',
  ],
  PriceBasedTags: [
    'Budget-Friendly',
    'Premium',
    'Luxury',
    'Discounted',
    'Free Shipping',
  ],
  UsageBasedTags: [
    'Eco-Friendly',
    'Handmade',
    'Customizable',
    'Giftable',
    'Multi-Pack',
    'One-Size',
    'Portable',
    'Rechargeable',
    'DIY Kit',
  ],
  DemographicTags: [
    'Men',
    'Women',
    'Kids',
    'Unisex',
    'Teens',
    'Baby Essentials',
  ],
  MaterialQualityTags: [
    'Organic',
    'Vegan',
    'Sustainable',
    'Durable',
    'Lightweight',
    'Waterproof',
    'BPA-Free',
  ],
  Others: [],
};
