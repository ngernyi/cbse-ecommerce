import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Save, Loader } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await updateProfile(formData);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="text-center">Please log in to view your profile.</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--spacing-8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold' }}>My Profile</h1>
            </div>

            <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-8)' }}>
                {/* Left Column: Avatar & Summary */}
                <div style={{ textAlign: 'center', borderRight: '1px solid var(--color-border)', paddingRight: 'var(--spacing-8)' }}>
                    <img
                        src={user.avatar || 'https://via.placeholder.com/150'}
                        alt="Profile"
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: 'var(--spacing-4)',
                            border: '4px solid var(--color-bg-body)'
                        }}
                    />
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>{user.name}</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>Customer</p>
                </div>

                {/* Right Column: Details Form */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Personal Information</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            <a href="/addresses" className="btn btn-outline" style={{ fontSize: 'var(--font-size-xs)' }}>
                                Manage Addresses
                            </a>
                            <a href="/payment-methods" className="btn btn-outline" style={{ fontSize: 'var(--font-size-xs)' }}>
                                Payment Methods
                            </a>
                            <a href="/orders" className="btn btn-outline" style={{ fontSize: 'var(--font-size-xs)' }}>
                                My Orders
                            </a>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-outline"
                                    style={{ fontSize: 'var(--font-size-xs)' }}
                                >
                                    Edit Details
                                </button>
                            )}
                        </div>
                    </div>

                    {message && (
                        <div style={{
                            padding: 'var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
                            color: message.includes('success') ? '#166534' : '#991b1b',
                            marginBottom: 'var(--spacing-4)',
                            fontSize: 'var(--font-size-sm)'
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>

                            {/* Name Field */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-muted)' }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-12)',
                                            borderRadius: 'var(--radius-md)',
                                            border: isEditing ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                            backgroundColor: isEditing ? 'white' : 'var(--color-bg-body)',
                                            color: 'var(--color-text-main)'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-muted)' }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-12)',
                                            borderRadius: 'var(--radius-md)',
                                            border: isEditing ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                            backgroundColor: isEditing ? 'white' : 'var(--color-bg-body)',
                                            color: 'var(--color-text-main)'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-muted)' }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-12)',
                                            borderRadius: 'var(--radius-md)',
                                            border: isEditing ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                            backgroundColor: isEditing ? 'white' : 'var(--color-bg-body)',
                                            color: 'var(--color-text-main)'
                                        }}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user.name || '',
                                                email: user.email || '',
                                                phone: user.phone || ''
                                            });
                                        }}
                                        className="btn btn-outline"
                                        style={{ flex: 1 }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-2)' }}
                                    >
                                        {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            )}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
