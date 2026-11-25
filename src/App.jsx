import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetails from './pages/ProductDetail'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import Info from './pages/Info'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
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
