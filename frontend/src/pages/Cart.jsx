import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { items, totals, updateQuantity, removeFromCart, applyCoupon, removeCoupon, coupon } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        setCouponError('');
        setCouponSuccess('');
        if (!couponCode) return;

        try {
            await applyCoupon(couponCode);
            setCouponSuccess(`Coupon ${couponCode} applied!`);
            setCouponCode('');
        } catch (error) {
            setCouponError(error.message);
        }
    };

    if (items.length === 0) {
        return (
            <div className="card text-center" style={{ padding: 'var(--spacing-16)' }}>
                <ShoppingBag size={64} className="mx-auto mb-6 opacity-20" />
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Your cart is empty</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-8)' }}>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-8)' }}>Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-8)' }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {items.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-1)' }}>{item.name}</h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{item.category}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                                    <span style={{ padding: '0 8px', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                                </div>
                                <div style={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={{ alignSelf: 'start' }}>
                    <div className="card">
                        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Order Summary</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                                <span style={{ fontWeight: 'medium' }}>${totals.subtotal.toFixed(2)}</span>
                            </div>

                            {coupon && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                                    <span>Discount ({coupon.code})</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span>-${totals.discount.toFixed(2)}</span>
                                        <button onClick={removeCoupon} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: 'var(--color-text-muted)' }}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
                                <span style={{ fontWeight: 'medium' }}>Free</span>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-2) 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span>${totals.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-6)' }}>
                            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <Tag size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Coupon Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                                <button type="submit" className="btn btn-outline" style={{ padding: '0 12px' }}>Apply</button>
                            </form>
                            {couponError && <p style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>{couponError}</p>}
                            {couponSuccess && <p style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>{couponSuccess}</p>}
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-base)' }}>
                            Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
