import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
const Root = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Products />
      <Footer />
      <Toaster />
    </div>
  );
};

export default Root;
