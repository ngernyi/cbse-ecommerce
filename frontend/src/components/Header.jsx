import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/');
        }
    };

    return (
        <header className="header" style={{
            backgroundColor: 'var(--color-bg-card)',
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--spacing-4) 0',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)'
                }}>
                    LuxeMarket
                </Link>

                {/* Search Bar (Placeholder) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-bg-body)',
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    borderRadius: 'var(--radius-full)',
                    width: '100%',
                    maxWidth: '400px',
                    border: '1px solid var(--color-border)'
                }}>
                    <Search size={20} color="var(--color-text-muted)" />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            marginLeft: 'var(--spacing-2)',
                            width: '100%',
                            outline: 'none',
                            color: 'var(--color-text-main)'
                        }}
                    />
                </div>

                {/* Navigation Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-6)' }}>
                    <Link to="/wishlist" style={{ color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                        <Heart size={24} />
                        <span>Wishlist</span>
                    </Link>
                    <Link to="/cart" style={{ color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 'var(--font-size-xs)', position: 'relative' }}>
                        <ShoppingCart size={24} />
                        <span>Cart</span>
                        {/* Cart Badge */}
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: 'var(--color-danger)',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                height: '16px',
                                width: '16px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>{cartCount}</span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center' }}>
                            <Link to="/admin" className="btn btn-outline" style={{ display: 'flex', gap: '8px', fontSize: 'var(--font-size-xs)' }}>
                                Admin Panel
                            </Link>
                            <Link to="/profile" style={{ color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                                <User size={24} />
                                <span>Account</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    fontSize: 'var(--font-size-xs)',
                                    cursor: 'pointer'
                                }}
                            >
                                <LogOut size={24} />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" style={{ color: 'var(--color-text-main)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                            <User size={24} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
