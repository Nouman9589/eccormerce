import { Routes, Route } from "react-router-dom";
import Home from '../Pages/Home';
import Accessories from "../Pages/Accessories";
import Footwear from "../Pages/FootWear";
import Shirts from "../Pages/Shirts";  
import AddProductForm from '../Pages/AddProductForm';
import DashboardItems from "../Pages/DashboardItems";
import Analytics from "../Pages/Analytics";
import Cloths from "../Pages/Cloths";
import ProductDetails from "../Pages/ProductDetails";
import CartPage from "../Pages/CartPage";
import SuccessPage from "../Pages/SuccesPage";
import FailedPage from "../Pages/FailedPage";
import Profile from "../Pages/Profile";
import Wishlist from "../Pages/Wishlist";
import AdminRoute from "../Components/AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/footwear" element={<Footwear />} />
      <Route path="/shirts" element={<Shirts />} />
      <Route path="/add-product" element={
        <AdminRoute>
          <AddProductForm />
        </AdminRoute>
      } />
      <Route path="/dashboard-items" element={
        <AdminRoute>
          <DashboardItems />
        </AdminRoute>
      } />
      <Route path="/analytics" element={
        <AdminRoute>
          <Analytics />
        </AdminRoute>
      } />
      <Route path="/cloths" element={<Cloths />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/failed" element={<FailedPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
};

export default AppRoutes;
