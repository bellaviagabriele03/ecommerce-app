import { z } from "zod";

export const shippingSchema = z.object({
    email: z.string().email("Enter a valid email address."),
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    street: z.string().min(1, "Required"),
    apartment: z.string().optional(),
    city: z.string().min(1, "Required"),
    zip: z.string().min(3, "Enter a valid ZIP code."),
    country: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    phone: z.string().min(7, "Enter a valid phone number."),
});

export const paymentSchema = z.object({
    cardName: z.string().min(1, "Required"),
    cardNumber: z
        .string()
        .regex(/^(\d{4} ?){3}\d{4}$/, "Enter a valid 16-digit card number."),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format."),
    cvv: z.string().regex(/^\d{3,4}$/, "Enter a valid security code."),
});
