import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Package, MapPin, AlertCircle, CheckCircle, XCircle, ArrowLeft, Loader } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = async () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            setCancelling(true);
            try {
                const updatedOrder = await orderService.requestCancellation(id);
                setOrder(updatedOrder);
                setMessage('Order cancelled successfully.');
            } catch (error) {
                setMessage(error.message);
            } finally {
                setCancelling(false);
            }
        }
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;
    if (!order) return <div className="text-center p-8">Order not found</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: 'var(--spacing-6)', color: 'var(--color-text-muted)' }}>
                <ArrowLeft size={16} /> Back to Orders
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--spacing-8)' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        Order #{order.id}
                        <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'normal', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border)' }}>
                            {order.status}
                        </span>
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--spacing-2)' }}>
                        Placed on {new Date(order.orderDate).toLocaleString()}
                    </p>
                </div>

                {order.status === 'Processing' && (
                    <button
                        onClick={handleCancelClick}
                        disabled={cancelling}
                        className="btn btn-outline"
                        style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    >
                        {cancelling ? 'Processing...' : 'Request Cancellation'}
                    </button>
                )}
            </div>

            {message && (
                <div style={{
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
                    color: message.includes('success') ? '#166534' : '#991b1b',
                    marginBottom: 'var(--spacing-4)',
                    fontSize: 'var(--font-size-sm)'
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-8)' }}>
                {/* Items */}
                <div className="card">
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Items</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                                <img
                                    src={item.product?.images?.[0]?.imageUrl || 'https://via.placeholder.com/60'}
                                    alt={item.product?.name || 'Product'}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontWeight: 'bold' }}>{item.product?.name || 'Unknown Product'}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Quantity: {item.quantity}</p>
                                </div>
                                <div style={{ fontWeight: 'bold' }}>
                                    ${(item.product?.price || 0).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-4) 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 'var(--font-size-lg)' }}>
                        <span>Total</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} /> Shipping Address
                    </h2>
                    <p style={{ fontWeight: 'bold' }}>{order.shippingAddress.fullName}</p>
                    <p style={{ color: 'var(--color-text-muted)' }}>{order.shippingAddress.street}</p>
                    <p style={{ color: 'var(--color-text-muted)' }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
