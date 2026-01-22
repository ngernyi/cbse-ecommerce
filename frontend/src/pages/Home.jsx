import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Loader } from 'lucide-react';

const Home = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            // Get user ID if logged in, else none
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : null;
            const data = await productService.getRecommendations(userId);
            setRecommendations(data);
        } catch (error) {
            console.error("Failed to load recommendations", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
                <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-4)' }}>Welcome to LuxeMarket</h1>
                <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-muted)' }}>Discover premium products curated just for you.</p>
            </div>

            <section>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-6)' }}>Recommended For You</h2>
                {loading ? (
                    <div className="text-center p-8"><Loader className="animate-spin mx-auto" /></div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'var(--spacing-6)'
                    }}>
                        {recommendations.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
