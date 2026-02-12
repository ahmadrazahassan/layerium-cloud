import { z } from "zod";

/**
 * Create server validation schema
 */
export const createServerSchema = z.object({
  plan_id: z.string().uuid("Invalid plan ID"),
  hostname: z
    .string()
    .min(1, "Hostname is required")
    .min(3, "Hostname must be at least 3 characters")
    .max(63, "Hostname must be less than 63 characters")
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Hostname must contain only lowercase letters, numbers, and hyphens"
    ),
  os_template: z.string().min(1, "OS template is required"),
  location: z.string().min(1, "Location is required"),
});

export type CreateServerInput = z.infer<typeof createServerSchema>;

/**
 * Update server validation schema
 */
export const updateServerSchema = z.object({
  hostname: z
    .string()
    .min(3, "Hostname must be at least 3 characters")
    .max(63, "Hostname must be less than 63 characters")
    .regex(
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/,
      "Hostname must contain only lowercase letters, numbers, and hyphens"
    )
    .optional(),
  reverse_dns: z
    .string()
    .regex(
      /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/,
      "Please enter a valid domain name"
    )
    .optional()
    .nullable(),
});

export type UpdateServerInput = z.infer<typeof updateServerSchema>;

/**
 * Server action validation schema
 */
export const serverActionSchema = z.object({
  action: z.enum(["start", "stop", "restart", "rebuild"], {
    message: "Invalid server action",
  }),
  os_template: z.string().optional(),
}).refine(
  (data) => {
    if (data.action === "rebuild" && !data.os_template) {
      return false;
    }
    return true;
  },
  {
    message: "OS template is required for rebuild action",
    path: ["os_template"],
  }
);

export type ServerActionInput = z.infer<typeof serverActionSchema>;

/**
 * Change password validation schema
 */
export const changePasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
