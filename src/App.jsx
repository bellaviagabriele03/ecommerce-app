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
    <Suspense fallback={<LoadingState />}>
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
          <Route path="shipping-returns" element={<Info pageKey="shippingReturns" />} />
          <Route path="size-guide" element={<Info pageKey="sizeGuide" />} />
          <Route path="contact" element={<Info pageKey="contact" />} />
          <Route path="privacy" element={<Info pageKey="privacy" />} />
          <Route path="terms" element={<Info pageKey="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
