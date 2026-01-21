import React, { useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { Trash2, ShoppingCart, HeartOff, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const data = await wishlistService.getWishlist();
            setItems(data);
        } catch (error) {
            console.error("Failed to load wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            const updated = await wishlistService.removeFromWishlist(id);
            setItems(updated);
        } catch (error) {
            console.error("Failed to remove item", error);
        }
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-8)' }}>My Wishlist</h1>

            {items.length === 0 ? (
                <div className="card text-center" style={{ padding: 'var(--spacing-12)' }}>
                    <HeartOff size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text-muted)' }} />
                    <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>Your wishlist is empty.</p>
                    <Link to="/" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--spacing-6)' }}>
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', paddingTop: '100%' }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                            <div style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-2)' }}>{item.name}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                                    ${item.price.toFixed(2)}
                                </p>
                                <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
                                    <button className="btn btn-primary" style={{ flex: 1, gap: 'var(--spacing-2)' }}>
                                        <ShoppingCart size={16} /> Add
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="btn btn-outline"
                                        style={{ color: 'var(--color-danger)', borderColor: 'var(--color-border)' }}
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
