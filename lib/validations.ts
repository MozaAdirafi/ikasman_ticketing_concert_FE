import { z } from 'zod'

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp number must be 10–13 digits')
    .max(13, 'WhatsApp number must be 10–13 digits')
    .regex(/^08\d{8,11}$/, 'WhatsApp must start with 08 (e.g. 081234567890)'),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>

export const orderSchema = registrationSchema.extend({
  ticket_id: z.string().min(1, 'Select a ticket'),
  quantity: z.number().int().min(1).max(10),
})

export type OrderFormValues = z.infer<typeof orderSchema>
