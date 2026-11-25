import { Routes, Route, Navigate } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import Info from './pages/Info'
import CheckoutLayout from './pages/checkout/CheckoutLayout'
import CheckoutShipping from './pages/checkout/Shipping'
import CheckoutPayment from './pages/checkout/Payment'
import CheckoutReview from './pages/checkout/Review'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/account/Login'
import Register from './pages/account/Register'
import Orders from './pages/account/Orders'
import Profile from './pages/account/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<CheckoutLayout />}>
            <Route index element={<Navigate to="shipping" replace />} />
            <Route path="shipping" element={<CheckoutShipping />} />
            <Route path="payment" element={<CheckoutPayment />} />
            <Route path="review" element={<CheckoutReview />} />
          </Route>
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          <Route path="account/login" element={<Login />} />
          <Route path="account/register" element={<Register />} />
          <Route
            path="account/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="account/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="shipping-returns" element={<Info title="Shipping & returns">
            <p>Standard shipping is free on orders over $150, 3-5 business days. Returns are accepted within 14 days of delivery, unworn and in original packaging.</p>
          </Info>} />
          <Route path="size-guide" element={<Info title="Size guide">
            <p>ShopNova footwear runs true to size. Between sizes? Go one size up. Apparel is cut in a regular fit unless stated otherwise.</p>
          </Info>} />
          <Route path="contact" element={<Info title="Contact">
            <p>Need a hand? Reach us at hello@shopnova.store and we'll get back to you within one business day.</p>
          </Info>} />
          <Route path="privacy" element={<Info title="Privacy policy">
            <p>This is a portfolio demo project. No real personal data is collected or stored.</p>
          </Info>} />
          <Route path="terms" element={<Info title="Terms of service">
            <p>This is a portfolio demo project built for demonstration purposes only — no real purchases take place.</p>
          </Info>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
