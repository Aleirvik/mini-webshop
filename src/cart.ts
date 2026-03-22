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

function formatPrice(value: number): string {
	return `${value.toLocaleString("nb-NO")} kr`;
}

function toggleVisibility(element: HTMLElement | null, visible: boolean, displayWhenVisible = "block") {
	if (!element) {
		return;
	}

	element.hidden = !visible;
	element.style.display = visible ? displayWhenVisible : "none";
}

function renderCart() {
	const container = document.getElementById("cart-items") as HTMLElement;
	const emptyMessage = document.getElementById("cart-empty") as HTMLElement;
	const totalElement = document.getElementById("cart-total") as HTMLElement;
	const cartActions = document.getElementById("cart-actions") as HTMLElement;
	const orderSection = document.getElementById("order-section") as HTMLElement;

	const cart = getCart();

	container.innerHTML = "";

	if (cart.length === 0) {
		emptyMessage.hidden = false;
		totalElement.textContent = "0 kr";
		toggleVisibility(cartActions, false);
		toggleVisibility(orderSection, false);
		return;
	}

	emptyMessage.hidden = true;
	toggleVisibility(cartActions, true, "block");
	toggleVisibility(orderSection, true, "flex");

	cart.forEach(item => {
		const row = document.createElement("article");
		row.className = "cart-item";
		row.innerHTML = `
			<img src="${item.image}" alt="${item.name}">
			<h3>${item.name}</h3>
			<p>Pris: ${formatPrice(item.price)}</p>
			<p>Antall: ${item.quantity}</p>
			<p>Sum: ${formatPrice(item.price * item.quantity)}</p>
			<div class="cart-item-actions">
				<button type="button" class="cart-minus" data-id="${item.id}">-</button>
				<button type="button" class="cart-plus" data-id="${item.id}">+</button>
				<button type="button" class="cart-remove" data-id="${item.id}">Fjern</button>
			</div>
		`;
		container.appendChild(row);
	});

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
	totalElement.textContent = formatPrice(total);
}

function increaseQuantity(id: number) {
	const cart = getCart();
	const item = cart.find(entry => entry.id === id);
	if (!item) {
		return;
	}

	item.quantity += 1;
	saveCart(cart);
	renderCart();
}

function decreaseQuantity(id: number) {
	const cart = getCart();
	const item = cart.find(entry => entry.id === id);
	if (!item) {
		return;
	}

	item.quantity -= 1;
	const updated = cart.filter(entry => entry.quantity > 0);
	saveCart(updated);
	renderCart();
}

function removeItem(id: number) {
	const cart = getCart().filter(item => item.id !== id);
	saveCart(cart);
	renderCart();
}

function setupCartEvents() {
	const container = document.getElementById("cart-items") as HTMLElement;
	container.addEventListener("click", event => {
		const target = event.target as HTMLElement;
		const idValue = target.getAttribute("data-id");
		if (!idValue) {
			return;
		}

		const id = Number(idValue);

		if (target.classList.contains("cart-plus")) {
			increaseQuantity(id);
		}

		if (target.classList.contains("cart-minus")) {
			decreaseQuantity(id);
		}

		if (target.classList.contains("cart-remove")) {
			removeItem(id);
		}
	});
}

function setupOrderForm() {
	const form = document.getElementById("order-form") as HTMLFormElement;

	form?.addEventListener("submit", event => {
		event.preventDefault();
		const cart = getCart();

		if (cart.length === 0) {
			alert("Handlelisten er tom.");
			return;
		}

		alert("Takk for bestillingen! En bestillingsbekreftelse er sendt til din e-post. Normal leveringstid er 3-5 virkedager.");
		localStorage.removeItem(CART_STORAGE_KEY);
		form.reset();
		renderCart();
	});
}

function setupClearCart() {
	const clearButton = document.getElementById("clear-cart") as HTMLButtonElement;
	clearButton?.addEventListener("click", () => {
		localStorage.removeItem(CART_STORAGE_KEY);
		renderCart();
	});
}

setupCartEvents();
setupOrderForm();
setupClearCart();
renderCart();
