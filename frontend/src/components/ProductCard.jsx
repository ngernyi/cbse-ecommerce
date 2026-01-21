import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';

const ProductCard = ({ product }) => {
    const handleAddToWishlist = async (e) => {
        e.preventDefault();
        // Simple toggle logic can be added here, for now just add
        await wishlistService.addToWishlist(product);
        alert(`${product.name} added to wishlist!`);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        // TODO: Implement Cart Service
        alert(`${product.name} added to cart!`);
    };

    return (
        <Link to={`/product/${product.id}`} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ position: 'relative', paddingTop: '100%' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
                <button
                    onClick={handleAddToWishlist}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'white',
                        borderRadius: '50%',
                        padding: '8px',
                        border: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer'
                    }}
                >
                    <Heart size={18} color="var(--color-danger)" />
                </button>
            </div>
            <div style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                    <div>
                        <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>{product.category}</span>
                        <h3 style={{ fontWeight: 'bold', fontSize: 'var(--font-size-base)', lineHeight: 1.2 }}>{product.name}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                        <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                        {product.rating}
                    </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
                    <button
                        onClick={handleAddToCart}
                        className="btn btn-primary"
                        style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-full)' }}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
