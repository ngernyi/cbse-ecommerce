import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await register(formData);
            navigate('/'); // Redirect to home/dashboard after successful registration
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="card">
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>Create Account</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}
                        placeholder="••••••••"
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)', width: '100%' }}>Create Account</button>
            </form>
            <p style={{ marginTop: 'var(--spacing-6)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 'var(--font-weight-medium)' }}>Sign in</Link>
            </p>
        </div>
    );
};

export default Register;
