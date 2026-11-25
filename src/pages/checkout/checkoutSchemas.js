import { z } from "zod";

export function getShippingSchema(t) {
    return z
        .object({
            email: z.string().email(t("checkout.invalidEmail")),
            firstName: z.string().min(1, t("checkout.required")),
            lastName: z.string().min(1, t("checkout.required")),
            street: z.string().min(1, t("checkout.required")),
            apartment: z.string().optional(),
            city: z.string().min(1, t("checkout.required")),
            zip: z.string().min(1, t("checkout.required")),
            country: z.string().min(1, t("checkout.required")),
            state: z.string().min(1, t("checkout.required")),
            phone: z.string().min(7, t("checkout.invalidPhone")),
        })
        .superRefine((data, ctx) => {
            if (data.country === "Italy") {
                if (!/^\d{5}$/.test(data.zip)) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["zip"], message: t("checkout.invalidCap") });
                }
            } else if (data.zip.trim().length < 3) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["zip"], message: t("checkout.invalidZip") });
            }
        });
}

export function getPaymentSchema(t) {
    return z.object({
        cardName: z.string().min(1, t("checkout.required")),
        cardNumber: z
            .string()
            .regex(/^(\d{4} ?){3}\d{4}$/, t("checkout.invalidCardNumber")),
        expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t("checkout.invalidExpiry")),
        cvv: z.string().regex(/^\d{3,4}$/, t("checkout.invalidCvv")),
    });
}
