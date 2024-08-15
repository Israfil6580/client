import { createContext, useState } from "react";
import axios from "axios";
export const AuthContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function AuthProvider({ children }) {
  const [products, setProducts] = useState([]);

  axios
    .get("http://localhost:5000/products")
    .then((response) => {
      setProducts(response.data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });

  const data = { products };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}
