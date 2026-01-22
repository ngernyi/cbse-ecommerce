import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';
import PaymentMethods from './pages/PaymentMethods';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router basename="/shop">
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<ProductList />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="profile" element={<Profile />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="payment-methods" element={<PaymentMethods />} />
                <Route path="cart" element={<Cart />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="orders/:id" element={<OrderDetails />} />
              </Route>

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="orders" element={<div>Orders Management (Coming Soon)</div>} />
                <Route path="customers" element={<div>Customer Management (Coming Soon)</div>} />
                <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
              </Route>
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
