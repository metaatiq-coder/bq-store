// Dashboard.js - Admin Panel - Atiq Super Store

let currentUser = null;
let editingProductId = null;

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

function checkAuth() {
    auth.onAuthStateChanged(async (user) => {
        const loginSection = document.getElementById('loginSection');
        const adminSection = document.getElementById('adminSection');

        if (!user) {
            if (loginSection) loginSection.classList.remove('hidden');
            if (adminSection) adminSection.classList.add('hidden');
            return;
        }

        try {
            const token = await user.getIdTokenResult();
            if (token.claims.admin === true) {
                currentUser = user;
                if (loginSection) loginSection.classList.add('hidden');
                if (adminSection) adminSection.classList.remove('hidden');
                loadProducts();
            } else {
                showToast('Admin access required', 'error');
                setTimeout(() => auth.signOut(), 2000);
            }
        } catch (error) {
            console.error('Auth error:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');

            try {
                if (errorEl) errorEl.classList.add('hidden');
                await auth.signInWithEmailAndPassword(email, password);
            } catch (error) {
                if (errorEl) {
                    errorEl.textContent = error.message;
                    errorEl.classList.remove('hidden');
                }
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => window.location.href = 'index.html');
        });
    }

    // Add Product
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('productName').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            let image = document.getElementById('productImage').value;
            const description = document.getElementById('productDescription').value;

            // Auto-assign image if not provided
            if (!image || image.trim() === '') {
                image = productImages[name] || defaultProductImage;
            }

            const formError = document.getElementById('formError');
            const formSuccess = document.getElementById('formSuccess');

            try {
                if (formError) formError.classList.add('hidden');
                
                await db.collection('products').add({
                    name, price,
                    image: image,
                    description,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                if (formSuccess) {
                    formSuccess.textContent = 'Product added!';
                    formSuccess.classList.remove('hidden');
                }

                productForm.reset();
                setTimeout(() => {
                    if (formSuccess) formSuccess.classList.add('hidden');
                    loadProducts();
                }, 1500);
            } catch (error) {
                if (formError) {
                    formError.textContent = 'Error: ' + error.message;
                    formError.classList.remove('hidden');
                }
            }
        });
    }

    // Edit Product
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!editingProductId) return;

            const name = document.getElementById('editName').value;
            let image = document.getElementById('editImage').value;

            // Auto-assign image if not provided
            if (!image || image.trim() === '') {
                image = productImages[name] || defaultProductImage;
            }

            await db.collection('products').doc(editingProductId).update({
                name: name,
                price: parseFloat(document.getElementById('editPrice').value),
                image: image,
                description: document.getElementById('editDescription').value,
                updatedAt: new Date()
            });

                showToast('Product updated!', 'success');
                closeEditModal();
                loadProducts();
            } catch (error) {
                showToast('Error updating product', 'error');
            }
        });
    }

    checkAuth();
});

async function loadProducts() {
    try {
        const container = document.getElementById('productsList');
        if (!container) return;

        const snapshot = await db.collection('products').get();
        container.innerHTML = '';

        if (snapshot.empty) {
            container.innerHTML = '<p class="col-span-full text-center text-gray-400">No products yet</p>';
            return;
        }

        snapshot.forEach(doc => {
            const p = { id: doc.id, ...doc.data() };
            
            // Assign automatic image if missing
            if (!p.image || p.image.includes('placeholder') || p.image === '') {
                p.image = productImages[p.name] || defaultProductImage;
            }
            
            const card = document.createElement('div');
            card.className = 'bg-white rounded border border-gray-200 overflow-hidden';
            
            const safeId = (p.id || '').replace(/'/g, "\\'");

            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-cover" onerror="this.src='${defaultProductImage}'">
                <div class="p-4">
                    <h3 class="font-bold text-gray-900 line-clamp-1">${p.name}</h3>
                    <p class="text-sm text-gray-600 line-clamp-1">${p.description || ''}</p>
                    <p class="text-gold font-bold mt-2">${formatPrice(p.price)}</p>
                    <div class="flex gap-2 mt-3">
                        <button onclick="openEditModal('${safeId}')" class="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">Edit</button>
                        <button onclick="deleteProduct('${safeId}')" class="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Delete</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

async function openEditModal(productId) {
    try {
        const doc = await db.collection('products').doc(productId).get();
        const p = doc.data();

        editingProductId = productId;

        const editName = document.getElementById('editName');
        const editPrice = document.getElementById('editPrice');
        const editImage = document.getElementById('editImage');
        const editDescription = document.getElementById('editDescription');

        if (editName) editName.value = p.name;
        if (editPrice) editPrice.value = p.price;
        if (editImage) editImage.value = p.image || '';
        if (editDescription) editDescription.value = p.description || '';

        const editModal = document.getElementById('editModal');
        if (editModal) editModal.classList.remove('hidden');
    } catch (error) {
        showToast('Error loading product', 'error');
    }
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) editModal.classList.add('hidden');
    editingProductId = null;
}

async function deleteProduct(productId) {
    if (!confirm('Delete this product?')) return;

    try {
        await db.collection('products').doc(productId).delete();
        showToast('Product deleted', 'success');
        loadProducts();
    } catch (error) {
        showToast('Error deleting product', 'error');
    }
}
