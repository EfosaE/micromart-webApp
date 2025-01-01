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

export type RegisterAccountAuth = z.infer<typeof authSchema>;

export const authSchemaWithoutName = authSchema.omit({ name: true });

export type GetUserByEmailAuth = z.infer<typeof authSchemaWithoutName>;

// Base Product Schema
const ImgTypeEnum = z.enum(['URL', 'FILE']); 

// Define the schema for each tag
const TagSchema = z.object({
  name: z.string().min(1, 'Tag name cannot be empty'),
  tagType: z.nativeEnum(TagTypes), // Use the existing TagTypes enum with z.nativeEnum
});

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
  tags: z.array(TagSchema)
  .min(1, 'Choose at least one tag')
  .max(10, 'Cannot have more than 10 tags'),
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
