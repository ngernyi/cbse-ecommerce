import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { wishlistService } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, Heart, Star, Minus, Plus, Loader } from 'lucide-react';
import api from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const data = await productService.getProductById(id);
            setProduct(data);
            const recs = await productService.getRecommendations();
            setRecommendations(recs.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to load product", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToWishlist = async () => {
        await wishlistService.addToWishlist(product);
        alert(`${product.name} added to wishlist!`);
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;
    if (!product) return <div className="text-center p-8">Product not found</div>;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-12)', marginBottom: 'var(--spacing-16)' }}>
                {/* Image */}
                <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img
                        src={
                            product.images && product.images.length > 0
                            ? `${api.defaults.baseURL}${product.images[0].imageUrl}`
                            : ''
                        }
                        alt={product.name}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                </div>

                {/* Details */}
                <div>
                    <div style={{ marginBottom: 'var(--spacing-2)', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', letterSpacing: '0.05em' }}>
                        {product.category}
                    </div>
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>{product.name}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
                        <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            ${product.price.toFixed(2)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: '#FEF3C7', borderRadius: '4px', color: '#B45309', fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                            <Star size={16} fill="#B45309" strokeWidth={0} />
                            {product.rating} ({product.reviews} reviews)
                        </div>
                    </div>

                    <p style={{ lineHeight: 1.8, color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-8)' }}>
                        {product.description}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                            <button onClick={() => handleQuantityChange(-1)} style={{ padding: 'var(--spacing-3)', background: 'none', border: 'none' }}><Minus size={16} /></button>
                            <span style={{ padding: '0 var(--spacing-4)', fontWeight: 'bold' }}>{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} style={{ padding: 'var(--spacing-3)', background: 'none', border: 'none' }}><Plus size={16} /></button>
                        </div>

                        <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, gap: 'var(--spacing-2)' }}>
                            <ShoppingCart size={20} /> Add to Cart
                        </button>

                        <button onClick={handleAddToWishlist} className="btn btn-outline" style={{ padding: 'var(--spacing-3)' }}>
                            <Heart size={24} />
                        </button>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: 'var(--spacing-8)' }} />

                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        <p>Free shipping on orders over $200</p>
                        <p>30-day return policy</p>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-8)' }}>You May Also Like</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: 'var(--spacing-6)'
                }}>
                    {recommendations.map(rec => (
                        <ProductCard key={rec.id} product={rec} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
