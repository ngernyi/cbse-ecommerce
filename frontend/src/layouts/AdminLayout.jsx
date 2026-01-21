import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/categories', icon: Package, label: 'Categories' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside style={{ width: '250px', backgroundColor: 'white', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>LuxeAdmin</h1>
                </div>

                <nav style={{ flex: 1, padding: '20px 0' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {navItems.map(item => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 24px',
                                        color: isActive(item.path) ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        backgroundColor: isActive(item.path) ? '#eff6ff' : 'transparent',
                                        textDecoration: 'none',
                                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                        borderRight: isActive(item.path) ? '3px solid var(--color-primary)' : '3px solid transparent'
                                    }}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={logout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px',
                            border: 'none',
                            background: 'none',
                            color: 'var(--color-danger)',
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
