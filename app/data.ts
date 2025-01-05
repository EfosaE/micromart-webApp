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
    'On Sale',
    'Limited Edition',
    'Exclusive',
    'Pre-order',
    'Clearance',
    'Bundle Offer',
    'Flash Deal',
    "Editor's Pick",
  ],
  AdminTags: [
    'Best Seller',
    'Trending',
    'Back in Stock',
    'Out of Stock',
    'Top Rated',
    'Featured Product',
    'Black Friday',
    'Cyber Monday',
    'Holiday Special',
    'Winter Sale',
    'Summer Sale',
    'Christmas Deals',
    "Valentine's Day Specials",
    'Back to School Deals',
    'Easter Specials',
  ],
  SeasonalTags: [
    'Rainy Collection',
    'Summer Collection',
  ],
  CategoryBasedTags: [
    'Clothing',
    'Shoes & Footwear',
    'Bags',
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
    'Office Supplies',
    'Jewelry & Accessories',
    'Appliances',
    'Furniture',
    'Pet Supplies',
    'Services',
    'Tools'
  ],
  ConditionBasedTags: [
    'New',
    'Refurbished',
    'Used',
    'Certified Pre-Owned',
    'Open Box',
    'Damaged',
  ],
  PriceBasedTags: [
    'Budget-Friendly',
    'Premium',
    'Luxury',
    'Discounted',
    'Free Delivery',
  ],
  UsageBasedTags: [
    'Eco-Friendly',
    'Handmade',
    'Customizable',
    'Giftable',
    'Multi-Pack',
    'Portable',
    'Rechargeable',
    'DIY Kit',
    'Weather Resistant',
    'Compact Design',
  ],
  DemographicTags: [
    'Men',
    'Women',
    'Kids',
    'Unisex',
    'Teens',
    'Baby Essentials',
    'Senior Friendly',
  ],
  MaterialQualityTags: [
    'Organic',
    'Vegan',
    'Sustainable',
    'Durable',
    'Lightweight',
    'Waterproof',
    'BPA-Free',
    'Recyclable',
    'Hypoallergenic',
    'Rust Resistant',
  ],
  FunctionalTags: [
    'Smart',
    'Bluetooth Enabled',
    'Wireless',
    'Energy Efficient',
    'Plug & Play',
    'Multi-Functional',
    'Ergonomic',
  ],
  Others: [],
};

