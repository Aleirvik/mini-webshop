
import type { Product } from "./types";

const CART_STORAGE_KEY = "mini-webshop-cart";

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

function getCart(): CartItem[] {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw) as CartItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveCart(cart: CartItem[]) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function addToCart(product: Product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }

    saveCart(cart);
}

async function loadProductDetail() {
    // 1. Les id fra URL
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id"));

    // 2. Hent alle produkter
    const response = await fetch("../products.json");
    const products: Product[] = await response.json();

    // 3. Finn riktig produkt
    const product = products.find(p => p.id === id);
    if (!product) {
        console.error("Produkt ikke funnet");
        return;
    }

    // 4. Fyll HTML-en
    const container = document.getElementById("product-detail") as HTMLElement;
    const images = (product as any).images || [product.images]; 
    let currentIndex = 0;
    // Støtte for både gamle og nye dataformat

    container.innerHTML = `
        <div class="image-slider">
            <button class="slider-btn prev" aria-label="Forrige bilde">❮</button>
            <img id="slider-image" src="${images[0]}" alt="${product.name}" class="detail-image">
            <button class="slider-btn next" aria-label="Neste bilde">❯</button>
        </div>    
        <h2>${product.name}</h2>
        <p><strong>Pris:</strong> ${product.price} kr</p>
        <p><strong>Merke:</strong> ${product.brand}</p>
        <p><strong>Størrelse:</strong> ${product.size || "N/A"}</p>
        <p>${product.description}</p>
        <button id="add-to-cart" class="btn" type="button">Legg i handleliste</button>
        <p id="add-to-cart-status" aria-live="polite"></p>
        <a href="products.html" class="btn">Tilbake</a>
    `;

    const imageElement = document.getElementById("slider-image") as HTMLImageElement;
    const prevBtn = container.querySelector(".prev") as HTMLButtonElement;
    const nextBtn = container.querySelector(".next") as HTMLButtonElement;

    if (!imageElement || !prevBtn || !nextBtn) {
        console.error("Fant ikke slider-elementene.");
        return;
    }

    const addToCartBtn = document.getElementById("add-to-cart") as HTMLButtonElement;
    const statusText = document.getElementById("add-to-cart-status") as HTMLParagraphElement;

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        imageElement.src = images[currentIndex];
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        imageElement.src = images[currentIndex];
    });

    addToCartBtn?.addEventListener("click", () => {
        addToCart(product);
        if (statusText) {
            statusText.textContent = "Lagt til i handlelisten.";
        }
    });

}

loadProductDetail();