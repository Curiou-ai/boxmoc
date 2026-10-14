import { z } from 'zod';

export const EmailSchema = z.string().email({ message: "Please enter a valid email address." });
export const NameSchema = z.string().min(2, { message: "Name must be at least 2 characters."});


export const StorefrontResponseSchema = z.object({
  data: z.any().optional(),
  errors: z.array(z.object({ message: z.string() })).optional(),
});
/**
 * Password validation schema to ensure security best practices.
 */
export const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[0-9]/, { message: "Password must contain at least one number." })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." });

/**
 * Validation schema for the 'contact_submissions' table (collection).
 */
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  phone: z.string().optional(),
  prompt: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => (data.prompt && data.prompt.length >= 10) || (data.notes && data.notes.length >= 10), {
  message: "Please provide a detailed message (at least 10 characters) in either the message or notes field.",
  path: ["prompt"],
});

/**
 * Validation schema for the 'waitlist' table (collection).
 */
export const WaitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  status: z.enum(['waitlisted', 'active', 'redeemed']).default('waitlisted'),
  source: z.string().optional().default('web_form'),
});
