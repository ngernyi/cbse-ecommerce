import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Package, ChevronRight, Loader } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getOrders();
            // Sort by date desc
            setOrders(data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'var(--color-success)';
            case 'Processing': return 'var(--color-accent)';
            case 'Cancelled': return 'var(--color-danger)';
            default: return 'var(--color-text-muted)';
        }
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-8)' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div className="card text-center" style={{ padding: 'var(--spacing-12)' }}>
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No orders found.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }}>Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                    {orders.map(order => (
                        <Link to={`/orders/${order.id}`} key={order.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: 'inherit', transition: 'transform 0.1s' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-1)' }}>
                                    <span style={{ fontWeight: 'bold' }}>{order.id}</span>
                                    <span style={{ fontSize: 'var(--font-size-xs)', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${getStatusColor(order.status)}`, color: getStatusColor(order.status) }}>{order.status}</span>
                                </div>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                    {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                                </p>
                                <p style={{ fontWeight: 'bold', marginTop: 'var(--spacing-2)' }}>${order.totalAmount.toFixed(2)}</p>
                            </div>
                            <ChevronRight size={20} color="var(--color-text-muted)" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
