import { supabase } from "./supabaseClient";

export async function createOrder(userId, order) {
    if (!supabase) return;

    const { error } = await supabase.from("orders").insert({
        user_id: userId,
        order_number: order.number,
        items: order.items,
        shipping: order.shipping,
        subtotal: order.subtotal,
        shipping_cost: order.shippingCost,
        tax: order.tax,
        total: order.total,
    });

    if (error) throw error;
}

export async function getOrdersForUser() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}
