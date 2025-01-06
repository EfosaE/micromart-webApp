import { z } from 'zod';
import { TagTypes } from '~/data';

export const authSchema = z.object({
  name: z
    .string()
    .min(3, 'Must contain at least 3 chars')
    .max(24, 'Must contain 24 chars max'),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Must contain at least 8 chars')
    .max(48, 'Must contain at most 48 chars'),
});
// Extended schema with category and business
export const vendorAuthSchema = authSchema.merge(
  z.object({
    categoryName: z
      .string()
      .min(3, 'Category must contain at least 3 chars')
      .max(50, 'Category must contain at most 50 chars'),
    businessName: z
      .string()
      .min(3, 'Business name must contain at least 3 chars')
      .max(100, 'Business name must contain at most 100 chars'),
  })
);
export type RegisterAccountAuth = z.infer<typeof authSchema>;
export type VendorAccountAuth = z.infer<typeof vendorAuthSchema>;

export const vendorAuthSchemaWithoutCName = vendorAuthSchema.omit({
  categoryName: true,
});

export const authSchemaWithoutName = authSchema.omit({ name: true });

export type GetUserByEmailAuth = z.infer<typeof authSchemaWithoutName>;

// Base Product Schema
const ImgTypeEnum = z.enum(['URL', 'FILE']);



export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Must contain at least 3 characters')
    .max(24, 'Must contain at most 24 characters'),
  price: z
    .number()
    .positive('Price must be greater than zero')
    .max(1_000_000, 'Price cannot exceed 1,000,000'),
  quantity: z
    .number()
    .positive('Qunatity must be greater than zero')
    .int('Quantity must be an integer')
    .nonnegative('Quantity cannot be negative'),
  tags: z
    .array(z.number()) // Ensure the array contains numbers
    .min(1, 'Choose at least one tag') // Minimum 1 item
    .max(10, 'Cannot have more than 10 tags'), // Maximum 10 items
  description: z
    .string()
    .min(10, 'Description must contain at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  imgUrl: z.string().url('Must be a valid URL').optional(),
  imgType: ImgTypeEnum,
});

// Type Inference
export type ProductSchema = z.infer<typeof productSchema>;

// Partial Schema (useful for updates)
export const partialProductSchema = productSchema.partial();
export type partialProductSchema = z.infer<typeof partialProductSchema>;

// Omit Specific Fields
export const productSchemaWithoutImgurl = productSchema.omit({
  description: true,
  imgUrl: true,
});
export type ProductSchemaWithoutTags = z.infer<
  typeof productSchemaWithoutImgurl
>;

// Pick Specific Fields (e.g., for a filtered request)
export const productSchemaMinimal = productSchema.pick({
  name: true,
  price: true,
});
export type ProductSchemaMinimal = z.infer<typeof productSchemaMinimal>;
