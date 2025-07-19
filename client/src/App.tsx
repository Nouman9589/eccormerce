import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AppRoutes from './Routes/AppRoutes';
import Mendeez from './Components/Mendeez';
import { ProductProvider } from './Context/ProductContext';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import { AnalyticsProvider } from './Context/AnalyticsContext';
import { WishlistProvider } from './Context/WishlistContext';
import { ReviewsProvider } from './Context/ReviewsContext';
import { NotificationProvider } from './Components/NotificationSystem';
import UserRoleStatus from './Components/UserRoleStatus';
import AdminTestHelper from './Components/AdminTestHelper';

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AnalyticsProvider>
          <WishlistProvider>
            <ReviewsProvider>
              <CartProvider>
                <ProductProvider>
                  <Router>
                    <div>
                      <Mendeez />
                      <Navbar />
                                          <AppRoutes />
                    <UserRoleStatus />
                    <AdminTestHelper />
                    </div>
                  </Router>
                </ProductProvider>
              </CartProvider>
            </ReviewsProvider>
          </WishlistProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
