import React, { useState, useEffect } from 'react';
import { addressService } from '../services/addressService';
import { Plus, Edit2, Trash2, MapPin, Check, X, Loader } from 'lucide-react';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form State
    const initialFormState = {
        label: '',
        fullName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error("Failed to load addresses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (address) => {
        setCurrentAddress(address);
        setFormData(address);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await addressService.deleteAddress(id);
                setAddresses(addresses.filter(a => a.id !== id));
            } catch (error) {
                console.error("Failed to delete address", error);
            }
        }
    };

    const handleAddNew = () => {
        setCurrentAddress(null);
        setFormData(initialFormState);
        setIsEditing(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (currentAddress) {
                await addressService.updateAddress(currentAddress.id, formData);
            } else {
                await addressService.addAddress(formData);
            }
            await loadAddresses(); // Reload to get updated default states etc.
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save address", error);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>My Addresses</h1>
                {!isEditing && (
                    <button onClick={handleAddNew} className="btn btn-primary" style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Plus size={18} /> Add New Address
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="card">
                    <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>
                        {currentAddress ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="label">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label className="label">Address Label (e.g. Home, Work)</label>
                                <input type="text" name="label" value={formData.label} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label className="label">Country</label>
                                <input type="text" name="country" value={formData.country} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="label">Street Address</label>
                                <input type="text" name="street" value={formData.street} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label className="label">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label className="label">State / Province</label>
                                <input type="text" name="state" value={formData.state} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div>
                                <label className="label">Zip Code</label>
                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleFormChange} id="isDefault" />
                                <label htmlFor="isDefault">Set as default address</label>
                            </div>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                {formLoading ? 'Saving...' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                    {addresses.map(addr => (
                        <div key={addr.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{addr.label}</span>
                                    {addr.isDefault && <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>Default</span>}
                                </div>
                                <p style={{ fontWeight: 500 }}>{addr.fullName}</p>
                                <p className="text-muted">{addr.street}</p>
                                <p className="text-muted">{addr.city}, {addr.state} {addr.zipCode}</p>
                                <p className="text-muted">{addr.country}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEdit(addr)} className="btn btn-outline" style={{ padding: '6px' }} title="Edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(addr.id)} className="btn btn-outline" style={{ padding: '6px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && (
                        <div className="text-center text-muted p-8 card">
                            <MapPin size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No addresses found. Add one to get started!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Addresses;
