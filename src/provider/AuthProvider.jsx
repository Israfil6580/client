/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("");
  // Fetch brands and categories only once
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsBrandsLoading(true);
        setIsCategoriesLoading(true);

        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/brands`),
          axios.get(`http://localhost:5000/categories`),
        ]);

        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching brands or categories:", error);
      } finally {
        setIsBrandsLoading(false);
        setIsCategoriesLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch products based on filters and pagination
  // Updated fetchProducts function in AuthProvider
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]); // Clear previous products

      try {
        const params = new URLSearchParams();
        if (brand) params.append("brand", brand);
        if (category) params.append("category", category);
        if (searchQuery) params.append("query", searchQuery);
        if (priceRange.length === 2) {
          params.append("minPrice", priceRange[0]);
          params.append("maxPrice", priceRange[1]);
        }
        params.append("page", page);
        params.append("limit", 9);

        // Add sorting parameters
        if (sort) params.append("sort", sort);

        const response = await axios.get(
          `http://localhost:5000/products?${params.toString()}`,
          { cancelToken: source.token }
        );

        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("Error fetching products:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [brand, category, searchQuery, priceRange, page, sort]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [brand, category, priceRange]);

  const value = {
    products,
    setProducts,
    page,
    setPage,
    totalPages,
    setTotalPages,
    categories,
    brands,
    isBrandsLoading,
    isCategoriesLoading,
    brand,
    setBrand,
    category,
    loading,
    setPriceRange,
    setCategory,
    setLoading,
    priceRange,
    searchQuery,
    setSearchQuery,
    sort,
    setSort,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
