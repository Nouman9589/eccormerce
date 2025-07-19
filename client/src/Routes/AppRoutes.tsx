import { Routes, Route } from "react-router-dom";
import Home from '../Pages/Home';
import Accessories from "../Pages/Accessories";
import Footwear from "../Pages/FootWear";
import Shirts from "../Pages/Shirts";  
import AddProductForm from '../Pages/AddProductForm';
import DashboardItems from "../Pages/DashboardItems";
import Cloths from "../Pages/Cloths";
import ProductDetails from "../Pages/ProductDetails";
import CartPage from "../Pages/CartPage";
import SuccessPage from "../Pages/SuccesPage";
import FailedPage from "../Pages/FailedPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/footwear" element={<Footwear />} />
      <Route path="/shirts" element={<Shirts />} />
      <Route path="/add-product" element={<AddProductForm />} />
      <Route path="/dashboard-items" element={<DashboardItems />} />
      <Route path="/cloths" element={<Cloths />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/failed" element={<FailedPage />} />
    </Routes>
  );
};

export default AppRoutes;
