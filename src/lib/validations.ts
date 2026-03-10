import { z } from 'zod';

export const EmailSchema = z.string().email({ message: "Please enter a valid email address." });
export const NameSchema = z.string().min(2, { message: "Name must be at least 2 characters."});

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
