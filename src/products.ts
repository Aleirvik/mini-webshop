console.log("products.ts loaded");

import type { Product } from "./types";

// Hent produkter fra JSON
async function loadProducts() {
    const response = await fetch("../products.json");
    const products: Product[] = await response.json();

    const grid = document.getElementById("product-grid") as HTMLElement;

    // Bygg HTML-kort for hvert produkt
    products.forEach(prod => {

        const div = document.createElement("div");
        div.className = "product-card";

        div.innerHTML = `
            <img src="${prod.images[0]}" alt="${prod.name}">
            <h3>${prod.name}</h3>
            <p>${prod.brand}</p>
            <p>${prod.price},-</p>
            <a href="product.html?id=${prod.id}" class="btn">Detaljer</a>
        `;

        grid.appendChild(div);
    });
}


loadProducts();
