// Cart.js - Shopping Cart - Atiq Super Store

let cart = [];

// Professional product images for common items (same as products.js)
const productImages = {
    'Sugar': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop',
    'Tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
    'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    'Flour': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    'Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
    'Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
    'Cold Drink': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop',
    'Soap': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    'Shampoo': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
    'Toothpaste': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    'Cooking Oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    'Salt': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop',
    'Eggs': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&h=400&fit=crop',
    'Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
    'Juice': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop',
    'Chips': 'https://images.unsplash.com/photo-1566479179815-4ba6a6c3f5b?w=400&h=400&fit=crop',
    'Chocolate': 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop',
    'Detergent': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    'Tissue': 'https://images.unsplash.com/photo-1585435557343-3b092031e2bb?w=400&h=400&fit=crop',
    'Water Bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop'
};

// Default product image for missing images
const defaultProductImage = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop';

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
        // Ensure image is assigned
        if (!item.image || item.image.includes('placeholder') || item.image === '') {
            item.image = productImages[item.name] || defaultProductImage;
        }

        const row = document.createElement('div');
        row.className = 'bg-white rounded border border-gray-200 p-4 flex items-center gap-4 hover:shadow transition';
        
        row.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded" onerror="this.src='${defaultProductImage}'">
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
