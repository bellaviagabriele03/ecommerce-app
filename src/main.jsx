import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LocaleProvider } from './context/LocaleContext.jsx'
import "./index.css"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </LocaleProvider>
    </BrowserRouter>

  </StrictMode>,
)
