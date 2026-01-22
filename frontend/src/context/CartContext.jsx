import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ subtotal: 0, discount: 0, total: 0 });

    useEffect(() => {
        loadCart();
    }, []);

    useEffect(() => {
        if (!loading) {
            const calculated = cartService.calculateTotals(items, coupon);
            setTotals(calculated);
            cartService.saveCart(items, coupon);
        }
    }, [items, coupon, loading]);

    const loadCart = async () => {
        try {
            const data = await cartService.getCart();
            setItems(data.items);
            setCoupon(data.coupon);
        } catch (error) {
            console.error("Failed to load cart", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prev, { ...product, quantity }];
            }
        });
        // Call backend
        cartService.addToCart(product, quantity).catch(err => console.error("Failed to add to cart", err));
    };

    const removeFromCart = (productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        setItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const applyCoupon = async (code) => {
        try {
            const validCoupon = await cartService.validateCoupon(code);
            setCoupon(validCoupon);
            return true;
        } catch (error) {
            throw error;
        }
    };

    const removeCoupon = () => {
        setCoupon(null);
    };

    const clearCart = () => {
        setItems([]);
        setCoupon(null);
    };

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items,
            coupon,
            totals,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            applyCoupon,
            removeCoupon,
            clearCart,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
