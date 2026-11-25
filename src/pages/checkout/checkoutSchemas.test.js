import { describe, expect, it } from "vitest";
import { paymentSchema, shippingSchema } from "./checkoutSchemas";

const validShipping = {
    email: "alex.morgan@email.com",
    firstName: "Alex",
    lastName: "Morgan",
    street: "123 Spring Street",
    apartment: "Apt 4B",
    city: "Brooklyn",
    zip: "11201",
    country: "United States",
    state: "New York",
    phone: "(917) 555-0128",
};

const validPayment = {
    cardName: "Alex Morgan",
    cardNumber: "4242 4242 4242 4242",
    expiry: "08/29",
    cvv: "123",
};

describe("shippingSchema", () => {
    it("accepts a fully filled, valid form", () => {
        expect(shippingSchema.safeParse(validShipping).success).toBe(true);
    });

    it("rejects an invalid email", () => {
        const result = shippingSchema.safeParse({ ...validShipping, email: "alex.morgan" });
        expect(result.success).toBe(false);
    });

    it("rejects a missing required field", () => {
        const result = shippingSchema.safeParse({ ...validShipping, firstName: "" });
        expect(result.success).toBe(false);
    });

    it("allows the optional apartment field to be omitted", () => {
        const withoutApartment = { ...validShipping };
        delete withoutApartment.apartment;
        expect(shippingSchema.safeParse(withoutApartment).success).toBe(true);
    });
});

describe("paymentSchema", () => {
    it("accepts a valid card", () => {
        expect(paymentSchema.safeParse(validPayment).success).toBe(true);
    });

    it("rejects a card number that isn't 16 digits", () => {
        const result = paymentSchema.safeParse({ ...validPayment, cardNumber: "4242 4242" });
        expect(result.success).toBe(false);
    });

    it("rejects an expiry date not in MM/YY format", () => {
        const result = paymentSchema.safeParse({ ...validPayment, expiry: "2029-08" });
        expect(result.success).toBe(false);
    });

    it("rejects a non-numeric security code", () => {
        const result = paymentSchema.safeParse({ ...validPayment, cvv: "12a" });
        expect(result.success).toBe(false);
    });
});
