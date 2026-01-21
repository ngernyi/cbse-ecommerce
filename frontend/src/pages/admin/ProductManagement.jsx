import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { Plus, Edit2, Trash2, Search, Loader } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.deleteProduct(id);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete product", error);
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Products</h1>
                <button className="btn btn-primary" style={{ display: 'flex', gap: '8px' }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div className="card" style={{ padding: '0' }}>
                {/* Toolbar */}
                <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 8px 8px 36px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-body)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '12px 16px' }}>Product</th>
                                <th style={{ padding: '12px 16px' }}>Category</th>
                                <th style={{ padding: '12px 16px' }}>Price</th>
                                <th style={{ padding: '12px 16px' }}>Rating</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <span style={{ fontWeight: 'medium' }}>{product.name}</span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>{product.category}</td>
                                    <td style={{ padding: '12px 16px' }}>${product.price.toFixed(2)}</td>
                                    <td style={{ padding: '12px 16px' }}>{product.rating} ★</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button className="btn btn-outline" style={{ padding: '6px' }} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn btn-outline"
                                                style={{ padding: '6px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
