import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import Layout from './components/Layout'
import Info from './pages/Info'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingState from './components/LoadingState'

const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const ProductDetails = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const NotFound = lazy(() => import('./pages/NotFound'))
const CheckoutLayout = lazy(() => import('./pages/checkout/CheckoutLayout'))
const CheckoutShipping = lazy(() => import('./pages/checkout/Shipping'))
const CheckoutPayment = lazy(() => import('./pages/checkout/Payment'))
const CheckoutReview = lazy(() => import('./pages/checkout/Review'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Login = lazy(() => import('./pages/account/Login'))
const Register = lazy(() => import('./pages/account/Register'))
const Orders = lazy(() => import('./pages/account/Orders'))
const Profile = lazy(() => import('./pages/account/Profile'))

function App() {

  return (
    <Suspense fallback={<LoadingState label="Loading..." />}>
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
    </Suspense>
  )
}

export default App
