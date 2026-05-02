// Cart.js - Shopping Cart - Atiq Super Store

let cart = [];

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart();
}

function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        if (emptyCart) emptyCart.classList.remove('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        return;
    }

    if (emptyCart) emptyCart.classList.add('hidden');
    if (cartSummary) cartSummary.classList.remove('hidden');
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'bg-white rounded border border-gray-200 p-4 flex items-center gap-4 hover:shadow transition';
        
        row.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="w-20 h-20 object-cover rounded" onerror="this.src='https://via.placeholder.com/80'">
            <div class="flex-1">
                <h3 class="font-bold text-gray-900">${item.name}</h3>
                <p class="text-sm text-gray-600">${formatPrice(item.price)} each</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="decreaseQuantity(${index})" class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">−</button>
                <span class="px-3 font-bold">${item.quantity}</span>
                <button onclick="increaseQuantity(${index})" class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">+</button>
            </div>
            <span class="font-bold text-gray-900 w-24 text-right">${formatPrice(item.price * item.quantity)}</span>
            <button onclick="removeFromCart(${index})" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">Remove</button>
        `;
        cartContainer.appendChild(row);
    });

    updateOrderSummary();
}

function increaseQuantity(index) {
    if (cart[index]) cart[index].quantity += 1;
    saveCart();
    displayCart();
}

function decreaseQuantity(index) {
    if (cart[index]) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            removeFromCart(index);
            return;
        }
    }
    saveCart();
    displayCart();
}

function removeFromCart(index) {
    if (cart[index]) {
        const name = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        displayCart();
        showToast(`${name} removed`, 'success');
    }
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Cart is empty', 'error');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.05;
            showToast(`Order placed! Total: ${formatPrice(total)}`, 'success');
            cart = [];
            saveCart();
            
            setTimeout(() => window.location.href = 'products.html', 2000);
        });
    }

    loadCart();
});
