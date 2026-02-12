import { z } from "zod";

/**
 * Create ticket validation schema
 */
export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  category: z.enum(["billing", "technical", "sales", "other"], {
    message: "Please select a valid category",
  }),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    message: "Please select a valid priority",
  }),
  message: z
    .string()
    .min(1, "Message is required")
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message must be less than 5000 characters"),
  server_id: z.string().uuid("Invalid server ID").optional().nullable(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

/**
 * Update ticket validation schema (admin)
 */
export const updateTicketSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

/**
 * Add ticket message validation schema
 */
export const addTicketMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .min(5, "Message must be at least 5 characters")
    .max(5000, "Message must be less than 5000 characters"),
});

export type AddTicketMessageInput = z.infer<typeof addTicketMessageSchema>;
