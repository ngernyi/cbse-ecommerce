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
            // No need to saveCart locally anymore, backend handles persistence
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

    const addToCart = async (product, quantity = 1) => {
        try {
            const data = await cartService.addToCart(product, quantity);
            setItems(data.items);
        } catch (error) {
            console.error("Failed to add to cart", error);
            alert("Failed to add to cart. Please try again.");
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            const data = await cartService.removeFromCart(cartItemId);
            setItems(data.items);
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const data = await cartService.updateQuantity(cartItemId, newQuantity);
            setItems(data.items);
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
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

    const clearCart = async () => {
        try {
            await cartService.clearCart();
            setItems([]);
            setCoupon(null);
        } catch (error) {
            console.error("Failed to clear cart", error);
        }
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
