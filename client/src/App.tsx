import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRoutes from './Routes/AppRoutes';
import Mendeez from './Components/Mendeez';
import { ProductProvider } from './Context/ProductContext';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import { NotificationProvider } from './Components/NotificationSystem';

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <Router>
              <div>
                <Mendeez />
                <Navbar />
                <AppRoutes />
              </div>
            </Router>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
