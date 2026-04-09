document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const activityLog = document.getElementById('activity-log');
    const productForm = document.getElementById('product-form');
    const modal = document.getElementById('product-modal');
    const showModalBtn = document.getElementById('show-modal-btn');
    const closeBtn = document.querySelector('.close-btn');

    async function fetchData() {
        try {
            const [productsRes, activitiesRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/activities')
            ]);
            const productsData = await productsRes.json();
            const activitiesData = await activitiesRes.json();
            renderProducts(productsData.data);
            renderActivities(activitiesData.data);
        } catch (err) { console.error('Error fetching data:', err); }
    }

    function renderProducts(products) {
        if (!products || products.length === 0) {
            productList.innerHTML = '<p class="text-muted">No products. Start adding some!</p>';
            return;
        }
        productList.innerHTML = products.map(product => `
            <div class="product-card glass">
                <div class="img-container">
                    <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}">
                    <div class="price-tag">$${product.price}</div>
                </div>
                <div class="product-info">
                    <span class="category-tag">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="card-footer">
                        <div class="stock-status">
                            <span class="dot ${product.inStock ? 'in-stock' : 'out-stock'}"></span>
                            ${product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                        <button onclick="toggleStock('${product._id}', ${product.inStock})" class="btn" title="Toggle Stock Status">🔄</button>
                        <button onclick="deleteProduct('${product._id}')" class="btn danger" title="Remove Product">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderActivities(activities) {
        if (!activities) return;
        activityLog.innerHTML = activities.map(activity => `
            <div class="log-item ${activity.action}">
                <div class="log-header">
                    <span>${activity.action}</span>
                    <span>${new Date(activity.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="log-title">${activity.taskTitle}</div>
                <div class="log-details">${activity.details}</div>
            </div>
        `).join('');
    }

    window.toggleStock = async (id, currentStatus) => {
        await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inStock: !currentStatus })
        });
        fetchData();
    };

    window.deleteProduct = async (id) => {
        if (!confirm('Remove product?')) return;
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchData();
    };

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productData = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value
        };
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (response.ok) {
            productForm.reset();
            modal.style.display = 'none';
            fetchData();
        }
    });

    showModalBtn.onclick = () => modal.style.display = 'flex';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    fetchData();
    setInterval(fetchData, 5000);
});
