import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Footer from "../components/Footer";

const Root = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Products />
      <Footer />
    </div>
  );
};

export default Root;
