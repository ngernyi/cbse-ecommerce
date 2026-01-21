import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { Plus, Trash2, CreditCard, Loader, Edit2 } from 'lucide-react';

const PaymentMethods = () => {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMethod, setCurrentMethod] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const initialFormState = {
        holderName: '',
        cardNumber: '', // In real app, this is tokenized
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        isDefault: false
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            const data = await paymentService.getPaymentMethods();
            setMethods(data);
        } catch (error) {
            console.error("Failed to load payment methods", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setCurrentMethod(null);
        setFormData(initialFormState);
        setIsEditing(true);
    };

    const handleEdit = (method) => {
        setCurrentMethod(method);
        setFormData({
            ...method,
            cardNumber: `**** **** **** ${method.last4}`, // Masked for display in edit (simulated)
            cvv: '***'
        });
        setIsEditing(true);
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this payment method?')) {
            try {
                await paymentService.deletePaymentMethod(id);
                setMethods(methods.filter(m => m.id !== id));
            } catch (error) {
                console.error("Failed to delete payment method", error);
            }
        }
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
            // Basic validation simulation
            if (formData.cardNumber.length < 12 && !currentMethod) {
                alert("Invalid card number");
                setFormLoading(false);
                return;
            }

            const methodData = {
                holderName: formData.holderName,
                expiryMonth: formData.expiryMonth,
                expiryYear: formData.expiryYear,
                isDefault: formData.isDefault,
                // Simulate tokenization/masking
                last4: formData.cardNumber.slice(-4),
                brand: 'Visa', // Mock brand detection
                type: 'Credit Card'
            };

            if (currentMethod) {
                await paymentService.updatePaymentMethod(currentMethod.id, methodData);
            } else {
                await paymentService.addPaymentMethod(methodData);
            }

            await loadMethods();
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save payment method", error);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>Payment Methods</h1>
                {!isEditing && (
                    <button onClick={handleAddNew} className="btn btn-primary" style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <Plus size={18} /> Add New Card
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="card">
                    <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)', fontWeight: 'bold' }}>
                        {currentMethod ? 'Edit Payment Method' : 'Add New Card'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="label">Cardholder Name</label>
                                <input type="text" name="holderName" value={formData.holderName} onChange={handleFormChange} required className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="label">Card Number</label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleFormChange}
                                    required={!currentMethod}
                                    disabled={!!currentMethod} // Can't change number on edit typically
                                    className="input w-full"
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    placeholder="0000 0000 0000 0000"
                                />
                            </div>

                            <div>
                                <label className="label">Expiry Month (MM)</label>
                                <input type="text" name="expiryMonth" value={formData.expiryMonth} onChange={handleFormChange} required maxLength="2" className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="MM" />
                            </div>

                            <div>
                                <label className="label">Expiry Year (YYYY)</label>
                                <input type="text" name="expiryYear" value={formData.expiryYear} onChange={handleFormChange} required maxLength="4" className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="YYYY" />
                            </div>

                            {!currentMethod && (
                                <div>
                                    <label className="label">CVV</label>
                                    <input type="text" name="cvv" value={formData.cvv} onChange={handleFormChange} required maxLength="4" className="input w-full" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} placeholder="123" />
                                </div>
                            )}

                            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleFormChange} id="isDefault" />
                                <label htmlFor="isDefault">Set as default payment method</label>
                            </div>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline">Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                {formLoading ? 'Saving...' : 'Save Card'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                    {methods.map(method => (
                        <div key={method.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                                <div style={{ backgroundColor: 'var(--color-bg-body)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                                    <CreditCard size={32} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{method.brand} ending in {method.last4}</span>
                                        {method.isDefault && <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>Default</span>}
                                    </div>
                                    <p className="text-muted">Expires {method.expiryMonth}/{method.expiryYear}</p>
                                    <p className="text-muted">{method.holderName}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEdit(method)} className="btn btn-outline" style={{ padding: '6px' }} title="Edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(method.id)} className="btn btn-outline" style={{ padding: '6px', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {methods.length === 0 && (
                        <div className="text-center text-muted p-8 card">
                            <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No payment methods saved.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
