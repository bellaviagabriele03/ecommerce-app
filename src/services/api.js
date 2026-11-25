import products from "../data/products.json";

const SIMULATED_DELAY = 500;

function delay(value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_DELAY));
}

export async function getProducts() {
    return delay(products);
}

export async function getProductBySlug(slug) {
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        throw new Error(`Prodotto "${slug}" non trovato`);
    }

    return delay(product);
}
