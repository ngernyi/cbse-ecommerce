import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1, padding: 'var(--spacing-8) 0' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
            <footer style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-inverted)',
                padding: 'var(--spacing-8) 0',
                marginTop: 'auto'
            }}>
                <div className="container text-center">
                    <p>&copy; 2026 LuxeMarket. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
