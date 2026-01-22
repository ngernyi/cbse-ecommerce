import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Loader, Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await orderService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessCancellation = async (orderId, approve) => {
        if (!window.confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this cancellation?`)) return;

        try {
            await orderService.processCancellation(orderId, approve);
            loadOrders(); // Reload to refresh status
        } catch (error) {
            console.error("Failed to process cancellation", error);
            alert("Failed to process request");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'var(--color-success)';
            case 'Processing': return 'var(--color-accent)';
            case 'CANCELLATION_REQUESTED': return 'var(--color-warning)'; // Assuming this status enum
            case 'CANCELLED': return 'var(--color-danger)';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '24px' }}>Order Management</h1>

            {loading ? (
                <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>
            ) : (
                <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-bg-body)', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '12px 16px' }}>Order ID</th>
                                <th style={{ padding: '12px 16px' }}>Date</th>
                                <th style={{ padding: '12px 16px' }}>Customer ID</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px' }}>Total</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '12px 16px' }}>#{order.id}</td>
                                    <td style={{ padding: '12px 16px' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px 16px' }}>{order.customerId}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            border: `1px solid ${getStatusColor(order.status)}`,
                                            color: getStatusColor(order.status)
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>${order.totalAmount.toFixed(2)}</td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            {order.status === 'CANCELLATION_REQUESTED' && (
                                                <>
                                                    <button
                                                        onClick={() => handleProcessCancellation(order.id, true)}
                                                        className="btn btn-outline"
                                                        style={{ color: 'google-green', borderColor: 'google-green', padding: '6px' }}
                                                        title="Approve Cancellation"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleProcessCancellation(order.id, false)}
                                                        className="btn btn-outline"
                                                        style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)', padding: '6px' }}
                                                        title="Reject Cancellation"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
