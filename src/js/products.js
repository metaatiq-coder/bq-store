// Products.js - Product Utilities - Atiq Super Store

let allProducts = [];

// Common super store products for search suggestions
const commonProducts = [
    'Sugar', 'Tea', 'Rice', 'Flour', 'Milk', 'Biscuits', 'Cold Drink', 'Shampoo', 'Soap', 'Toothpaste',
    'Cooking Oil', 'Salt', 'Eggs', 'Bread', 'Juice', 'Chips', 'Chocolate', 'Detergent', 'Tissue', 'Water Bottle'
];
// Professional product images for common items
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
        // Assign automatic image if missing
        if (!p.image || p.image.includes('placeholder') || p.image === '') {
            p.image = productImages[p.name] || defaultProductImage;
        }

        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition';
        
        const safeId = (p.id || '').replace(/'/g, "\\'");
        const safeName = (p.name || '').replace(/'/g, "\\'");

        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-cover" onerror="this.src='${defaultProductImage}'">
            <div class="p-4">
                <h3 class="font-bold text-gray-900 line-clamp-1">${p.name}</h3>
                <p class="text-gray-600 text-sm line-clamp-2 mb-2">${p.description || ''}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-gold">${formatPrice(p.price)}</span>
                    <button onclick="addToCart('${safeId}', '${safeName}', ${p.price}, '${p.image}')" class="px-3 py-2 bg-gold text-black font-bold rounded hover:bg-yellow-400 transition text-sm">
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
    // Ensure image is assigned
    if (!image || image.includes('placeholder') || image === '') {
        image = productImages[name] || defaultProductImage;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, name, price, image: image, quantity: 1 });
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

// Show search suggestions
function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;

    if (!query.trim()) {
        suggestionsContainer.classList.add('hidden');
        return;
    }

    // Get matching common products
    const matchingCommon = commonProducts.filter(product =>
        product.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    // Get matching existing products
    const matchingExisting = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const allSuggestions = [...new Set([...matchingCommon, ...matchingExisting.map(p => p.name)])];

    if (allSuggestions.length === 0) {
        suggestionsContainer.classList.add('hidden');
        return;
    }

    suggestionsContainer.innerHTML = '';
    allSuggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0';
        div.textContent = suggestion;
        div.addEventListener('click', () => {
            document.getElementById('searchInput').value = suggestion;
            suggestionsContainer.classList.add('hidden');
            filterProducts();
        });
        suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.classList.remove('hidden');
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        setTimeout(() => suggestionsContainer.classList.add('hidden'), 150);
    }
}

// Handle clicks outside search
document.addEventListener('click', (e) => {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (searchInput && suggestionsContainer && !searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.classList.add('hidden');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('searchInput');
    if (search) {
        search.addEventListener('input', (e) => {
            const query = e.target.value;
            showSearchSuggestions(query);
            debounce(filterProducts, 300)();
        });
        search.addEventListener('blur', hideSearchSuggestions);
        search.addEventListener('focus', (e) => {
            if (e.target.value.trim()) showSearchSuggestions(e.target.value);
        });
    }
    
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