// Products.js - Product Utilities - Atiq Super Store

let allProducts = [];

// Load Products from Firestore
async function loadProducts() {
    try {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            container.innerHTML = '<p class="col-span-full text-center text-gray-400">No products available</p>';
            return;
        }

        allProducts = [];
        snapshot.forEach(doc => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });

        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

// Display Products
function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    container.innerHTML = '';
    if (products.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-400">No products found</p>';
        return;
    }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition';
        
        const safeId = (p.id || '').replace(/'/g, "\\'");
        const safeName = (p.name || '').replace(/'/g, "\\'");

        card.innerHTML = `
            <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300'">
            <div class="p-4">
                <h3 class="font-bold text-gray-900 line-clamp-1">${p.name}</h3>
                <p class="text-gray-600 text-sm line-clamp-2 mb-2">${p.description || ''}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gold">${formatPrice(p.price)}</span>
                    <button onclick="addToCart('${safeId}', '${safeName}', ${p.price}, '${p.image || ''}')" class="px-3 py-2 bg-gold text-black font-bold rounded hover:bg-yellow-400 transition text-sm">
                        Buy
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Add to Cart
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, name, price, image: image || '', quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${name} added to cart!`, 'success');
}

// Filter and Sort
function filterProducts() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
    const sort = document.getElementById('sortSelect')?.value || '';

    let filtered = allProducts.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search) || 
                           (p.description?.toLowerCase().includes(search) || false);
        const matchPrice = p.price >= minPrice && p.price <= maxPrice;
        return matchSearch && matchPrice;
    });

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    displayProducts(filtered);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('searchInput');
    if (search) search.addEventListener('input', debounce(filterProducts, 300));
    
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) filterBtn.addEventListener('click', filterProducts);
    
    const sort = document.getElementById('sortSelect');
    if (sort) sort.addEventListener('change', filterProducts);

    const minPrice = document.getElementById('minPrice');
    if (minPrice) minPrice.addEventListener('change', filterProducts);
    
    const maxPrice = document.getElementById('maxPrice');
    if (maxPrice) maxPrice.addEventListener('change', filterProducts);

    loadProducts();
});

    });

    // Sort
    if (sort === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayProducts(filteredProducts);
}

// Event Listeners
document.getElementById('filterBtn')?.addEventListener('click', filterProducts);
document.getElementById('sortSelect')?.addEventListener('change', filterProducts);
document.getElementById('minPrice')?.addEventListener('change', filterProducts);
document.getElementById('maxPrice')?.addEventListener('change', filterProducts);

// Close modal when clicking outside
document.getElementById('productModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        closeModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadProducts);