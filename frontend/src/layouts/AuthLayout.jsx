import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-body)',
            backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: 'var(--spacing-4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-primary)', fontWeight: 'bold' }}>LuxeMarket</h1>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
