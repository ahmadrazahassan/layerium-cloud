import { z } from "zod";

/**
 * Create pricing plan validation schema (admin)
 */
export const createPricingPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  type: z.enum(["VPS", "RDP"], {
    message: "Please select a valid plan type",
  }),
  cpu_cores: z
    .number()
    .int("CPU cores must be a whole number")
    .min(1, "At least 1 CPU core is required")
    .max(64, "Maximum 64 CPU cores"),
  ram_gb: z
    .number()
    .int("RAM must be a whole number")
    .min(1, "At least 1 GB RAM is required")
    .max(512, "Maximum 512 GB RAM"),
  storage_gb: z
    .number()
    .int("Storage must be a whole number")
    .min(10, "At least 10 GB storage is required")
    .max(10000, "Maximum 10 TB storage"),
  bandwidth_tb: z
    .number()
    .min(0.5, "At least 0.5 TB bandwidth is required")
    .max(100, "Maximum 100 TB bandwidth"),
  price_usd: z
    .number()
    .min(0, "Price cannot be negative")
    .max(10000, "Maximum price is $10,000"),
  price_pkr: z
    .number()
    .min(0, "Price cannot be negative")
    .max(3000000, "Maximum price is Rs 3,000,000"),
  locations: z
    .array(z.string())
    .min(1, "At least one location is required"),
  features: z.array(z.string()).default([]),
  is_popular: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export type CreatePricingPlanInput = z.infer<typeof createPricingPlanSchema>;

/**
 * Update pricing plan validation schema (admin)
 */
export const updatePricingPlanSchema = createPricingPlanSchema.partial();

export type UpdatePricingPlanInput = z.infer<typeof updatePricingPlanSchema>;
