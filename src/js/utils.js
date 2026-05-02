// Utility Functions - Atiq Super Store

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || (() => {
        const div = document.createElement('div');
        div.id = 'toastContainer';
        div.className = 'fixed top-4 right-4 z-50 space-y-4';
        document.body.appendChild(div);
        return div;
    })();

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    toast.className = `${bgColor} text-white px-4 py-2 rounded shadow-lg text-sm`;
    toast.textContent = message;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = cart.length;
}

async function updateAdminButton() {
    const adminBtn = document.getElementById('adminBtn');
    if (!adminBtn || typeof auth === 'undefined') return;
    
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            adminBtn.classList.add('hidden');
            return;
        }
        
        try {
            const token = await user.getIdTokenResult();
            if (token.claims.admin === true) {
                adminBtn.classList.remove('hidden');
            } else {
                adminBtn.classList.add('hidden');
            }
        } catch {
            adminBtn.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateAdminButton();
});

