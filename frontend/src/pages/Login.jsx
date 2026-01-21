import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Sign In</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Email</label>
                    <input
                        type="email"
                        className="input"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Password</label>
                    <input
                        type="password"
                        className="input"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                        placeholder="••••••••"
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
