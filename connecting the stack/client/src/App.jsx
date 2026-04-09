import React, { useState, useEffect } from 'react';
import { productAPI, activityAPI } from './api';
import './App.css';
import { Plus, Trash2, RefreshCw, X, ShoppingCart, Activity } from 'lucide-react';

function App() {
    const [products, setProducts] = useState([]);
    const [activities, setActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Electronics',
        description: ''
    });

    const fetchData = async () => {
        try {
            const [pRes, aRes] = await Promise.all([
                productAPI.getAll(),
                activityAPI.getAll()
            ]);
            setProducts(pRes.data.data);
            setActivities(aRes.data.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await productAPI.create(formData);
            setFormData({ name: '', price: '', category: 'Electronics', description: '' });
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const handleToggleStock = async (id, currentStatus) => {
        try {
            await productAPI.update(id, { inStock: !currentStatus });
            fetchData();
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await productAPI.delete(id);
            fetchData();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    return (
        <div className="dashboard-container">
            <header>
                <h1>TechStore <span>Inventory Hub</span></h1>
                <p className="subtitle">React-Mongoose Stack Connection</p>
            </header>

            <div className="main-content">
                <section className="inventory-section">
                    <div className="card-header">
                        <h2><ShoppingCart size={20} /> Store Inventory</h2>
                        <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
                            <Plus size={20} /> Add New Product
                        </button>
                    </div>

                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product._id} className="product-card glass">
                                <div className="img-container">
                                    <img src={product.image || 'https://via.placeholder.com/300x200'} alt={product.name} />
                                    <div className="price-tag">${product.price}</div>
                                </div>
                                <div className="product-info">
                                    <span className="category-tag">{product.category}</span>
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <div className="card-footer">
                                        <div className="stock-status">
                                            <span className={`dot ${product.inStock ? 'in-stock' : 'out-stock'}`}></span>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn icon" onClick={() => handleToggleStock(product._id, product.inStock)}>
                                                <RefreshCw size={18} />
                                            </button>
                                            <button className="btn btn-danger icon" onClick={() => handleDelete(product._id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="activity-section">
                    <h2><Activity size={20} /> Real-time History</h2>
                    <div className="activity-log glass">
                        {activities.map(activity => (
                            <div key={activity._id} className={`log-item ${activity.action}`}>
                                <div className="log-header">
                                    <span>{activity.action}</span>
                                    <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <div className="log-title">{activity.taskTitle}</div>
                                <div className="log-details">{activity.details}</div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass">
                        <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        <h2>Product Details</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. MacBook Pro M3" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input 
                                    type="number" 
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                    placeholder="1999.00" 
                                    step="0.01" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option>Electronics</option>
                                    <option>Laptops</option>
                                    <option>Smartphones</option>
                                    <option>Audio</option>
                                    <option>Accessories</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Product specifications..." 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">Add to Catalog</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
