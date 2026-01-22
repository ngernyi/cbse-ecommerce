import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Sign In</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)', width: '100%' }}>Sign In</button>
            </form>
            <p style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 'var(--font-weight-medium)' }}>Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
