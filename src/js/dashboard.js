// Dashboard.js - Admin Panel - Atiq Super Store

let currentUser = null;
let editingProductId = null;

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
            const image = document.getElementById('productImage').value;
            const description = document.getElementById('productDescription').value;

            const formError = document.getElementById('formError');
            const formSuccess = document.getElementById('formSuccess');

            try {
                if (formError) formError.classList.add('hidden');
                
                await db.collection('products').add({
                    name, price,
                    image: image || 'https://via.placeholder.com/300',
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

            try {
                await db.collection('products').doc(editingProductId).update({
                    name: document.getElementById('editName').value,
                    price: parseFloat(document.getElementById('editPrice').value),
                    image: document.getElementById('editImage').value || 'https://via.placeholder.com/300',
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
            const card = document.createElement('div');
            card.className = 'bg-white rounded border border-gray-200 overflow-hidden';
            
            const safeId = (p.id || '').replace(/'/g, "\\'");

            card.innerHTML = `
                <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}" class="w-full h-40 object-cover" onerror="this.src='https://via.placeholder.com/300'">
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
