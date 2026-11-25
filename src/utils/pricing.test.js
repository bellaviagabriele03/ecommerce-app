import { describe, expect, it } from "vitest";
import { calculateTotals, discountRateFor } from "./pricing";

describe("discountRateFor", () => {
    it("recognises WELCOME10 regardless of case and spacing", () => {
        expect(discountRateFor(" welcome10 ")).toBe(0.1);
    });

    it("returns 0 for unknown or empty codes", () => {
        expect(discountRateFor("NOPE")).toBe(0);
        expect(discountRateFor(null)).toBe(0);
    });
});

describe("calculateTotals", () => {
    it("charges flat shipping below the free-shipping threshold", () => {
        const totals = calculateTotals(100);
        expect(totals.shipping).toBe(9.95);
        expect(totals.total).toBeCloseTo(100 + 9.95 + 8);
    });

    it("applies the discount before shipping and tax", () => {
        const totals = calculateTotals(200, 0.1);
        expect(totals.discount).toBe(20);
        expect(totals.discountedSubtotal).toBe(180);
        expect(totals.shipping).toBe(0);
        expect(totals.tax).toBeCloseTo(14.4);
        expect(totals.total).toBeCloseTo(194.4);
    });

    it("loses free shipping if the discount drops the subtotal under the threshold", () => {
        const totals = calculateTotals(160, 0.1);
        expect(totals.discountedSubtotal).toBe(144);
        expect(totals.shipping).toBe(9.95);
    });
});
