import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { DollarSign, ShoppingBag, Package, TrendingUp, Loader } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{title}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '24px' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard title="Total Sales" value={`$${stats.totalSales.toFixed(2)}`} icon={DollarSign} color="#16a34a" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="#2563eb" />
                <StatCard title="Total Products" value={stats.totalProducts} icon={Package} color="#9333ea" />
                <StatCard title="Growth" value="+12.5%" icon={TrendingUp} color="#ea580c" />
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Recent Orders</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '12px' }}>Order ID</th>
                                <th style={{ padding: '12px' }}>Date</th>
                                <th style={{ padding: '12px' }}>Customer</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '12px' }}>{order.id}</td>
                                    <td style={{ padding: '12px' }}>{new Date(order.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px' }}>{order.shippingAddress.fullName}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Processing' ? '#fef3c7' : '#fee2e2',
                                            color: order.status === 'Delivered' ? '#166534' : order.status === 'Processing' ? '#b45309' : '#991b1b',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>${order.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
