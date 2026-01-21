import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, Loader } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const categoryParam = searchParams.get('category') || '';
    const searchParam = searchParams.get('search') || '';
    const sortParam = searchParams.get('sort') || '';

    useEffect(() => {
        loadData();
    }, [categoryParam, searchParam, sortParam]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([
                productService.getAllProducts({
                    category: categoryParam,
                    search: searchParam,
                    sort: sortParam
                }),
                productService.getCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (e) => {
        setSearchParams(params => {
            if (e.target.value) params.set('sort', e.target.value);
            else params.delete('sort');
            return params;
        });
    };

    const handleCategoryChange = (category) => {
        setSearchParams(params => {
            if (category) params.set('category', category);
            else params.delete('category');
            return params;
        });
    };

    return (
        <div>
            {/* Header & Controls */}
            <div style={{ marginBottom: 'var(--spacing-8)' }}>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>
                    {categoryParam ? `${categoryParam}` : searchParam ? `Search Results for "${searchParam}"` : 'All Products'}
                </h1>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                    {/* Categories Filter (Desktop-ish) */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => handleCategoryChange('')}
                            className={`btn ${!categoryParam ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: 'var(--font-size-xs)' }}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`btn ${categoryParam === cat ? 'btn-primary' : 'btn-outline'}`}
                                style={{ fontSize: 'var(--font-size-xs)' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <SlidersHorizontal size={18} color="var(--color-text-muted)" />
                        <select
                            value={sortParam}
                            onChange={handleSortChange}
                            style={{
                                padding: 'var(--spacing-2)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)',
                                outline: 'none',
                                fontSize: 'var(--font-size-sm)'
                            }}
                        >
                            <option value="">Default Sorting</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>
            ) : products.length === 0 ? (
                <div className="text-center p-12 card">
                    <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-muted)' }}>No products found matching your criteria.</p>
                    <button onClick={() => setSearchParams({})} className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }}>
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--spacing-6)'
                }}>
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
