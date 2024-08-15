import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Products from "../components/Products";

const Root = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Products />
    </div>
  );
};

export default Root;
