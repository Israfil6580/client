/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import auth from "../../firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";

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
  const [user, setUser] = useState();
  const image_hosting_key = import.meta.env.VITE_image_hosting_key;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
  const provider = new GoogleAuthProvider();
  const [firebaseLoading, setFirebaseLoading] = useState(false);
  // Fetch brands and categories only once
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsBrandsLoading(true);
        setIsCategoriesLoading(true);

        const [brandsResponse, categoriesResponse] = await Promise.all([
          axios.get(`https://server-5vz2.vercel.app/brands`),
          axios.get(`https://server-5vz2.vercel.app/categories`),
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
          `https://server-5vz2.vercel.app/products?${params.toString()}`,
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

  // onauthstagechange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  // create user
  // Create user
  const createUser = async (email, password, name, file) => {
    setFirebaseLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Upload image and get URL
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(image_hosting_api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.data.url;

      // Update user profile with name and photo
      await updateProfile(userCredential.user, {
        displayName: name || "",
        photoURL: imageUrl || "",
      });

      // Refresh user state
      const updatedUser = auth.currentUser;
      toast.success("Account Create Successfully");
      setUser(updatedUser);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFirebaseLoading(false);
    }
  };

  // google sign in

  const googleSignIn = async () => {
    setFirebaseLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        toast.success("Signin Successfully with Google");
        setFirebaseLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
        setFirebaseLoading(false);
      });
  };

  const emailSignIn = async (email, password) => {
    setFirebaseLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        toast.success("Signin Successfully with Email");
        setFirebaseLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Invalid Email and Password");
        setFirebaseLoading(false);
      });
  };

  const logout = async () => {
    signOut(auth)
      .then(() => {
        toast.success("Signout Successful!");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
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
    createUser,
    googleSignIn,
    emailSignIn,
    user,
    logout,
    firebaseLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
