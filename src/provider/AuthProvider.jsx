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

// eslint-disable-next-line react/prop-types
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
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await axios.get(
          "https://server-sand-seven-98.vercel.app/api/categories"
        );
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error(
            "Unexpected data format for categories:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      setIsBrandsLoading(true);
      try {
        const response = await axios.get(
          "https://server-sand-seven-98.vercel.app/api/brands"
        );
        if (Array.isArray(response.data)) {
          setBrands(response.data);
        } else {
          console.error("Unexpected data format for brands:", response.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error.message);
      } finally {
        setIsBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Fetch products based on filters and pagination
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]);

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
        if (sort) params.append("sort", sort);

        const response = await axios.get(
          `https://server-sand-seven-98.vercel.app/products?${params.toString()}`,
          { cancelToken: source.token }
        );

        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("Error fetching products:", error.message);
          console.error(
            "Error response data:",
            error.response ? error.response.data : "No response data"
          );
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

  // onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign Up
  const signUpUser = async (email, password, name, photoFile) => {
    try {
      setFirebaseLoading(true);

      // Upload profile image
      let photoURL = "";
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);

        const response = await axios.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
          photoURL = response.data.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Create user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // Update profile
      await updateProfile(user, { displayName: name, photoURL });

      setUser(user);
      toast.success("Sign up successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Sign In
  const signInUser = async (email, password) => {
    try {
      setFirebaseLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      setUser(user);
      toast.success("Sign in successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    try {
      setFirebaseLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUser(user);
      toast.success("Sign in with Google successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFirebaseLoading(false);
    }
  };

  // Sign Out
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signUpUser,
        signInUser,
        signInWithGoogle,
        logOut,
        products,
        page,
        setPage,
        totalPages,
        categories,
        brands,
        isBrandsLoading,
        isCategoriesLoading,
        setBrand,
        setCategory,
        setPriceRange,
        setSearchQuery,
        setSort,
        loading,
        firebaseLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
