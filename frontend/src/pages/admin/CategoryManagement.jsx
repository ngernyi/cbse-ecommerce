import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await productService.getCategories();
            // Mock objectifying categories since service returns strings
            setCategories(data.map((cat, index) => ({ id: index, name: cat })));
        } catch (error) {
            console.error("Failed to load categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this category?')) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Categories</h1>
                <button className="btn btn-primary" style={{ display: 'flex', gap: '8px' }}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: '12px' }}>Category Name</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '12px' }}>{category.name}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ padding: '6px' }}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="btn btn-outline"
                                            style={{ padding: '6px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
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
    );
};

export default CategoryManagement;
