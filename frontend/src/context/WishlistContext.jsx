import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadWishlist = async () => {
            if (user) {
                setLoading(true);
                try {
                    const wishlistData = await wishlistService.getWishlist();
                    setWishlist(wishlistData);
                } catch (error) {
                    console.error("Failed to load wishlist", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setWishlist([]);
                setLoading(false);
            }
        };
        loadWishlist();
    }, [user]);

    const addToWishlist = async (product) => {
        try {
            const updatedWishlist = await wishlistService.addToWishlist(product);
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error("Failed to add to wishlist", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const updatedWishlist = await wishlistService.removeFromWishlist(productId);
            setWishlist(updatedWishlist);
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
