import { useContext, useCallback } from "react";
import { ScrollRestoration } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { Watch } from "react-loader-spinner";
import ProductCard from "./card/ProductCard";

const Products = () => {
  const {
    products,
    page,
    setPage,
    totalPages,
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
  } = useContext(AuthContext);

  const isLoading = isBrandsLoading || isCategoriesLoading || loading;
  // Handle changes in brand, category, and price range
  const handleBrandChange = useCallback(
    (e) => setBrand(e.target.value),
    [setBrand]
  );

  const handleCategoryChange = useCallback(
    (e) => setCategory(e.target.value),
    [setCategory]
  );

  const handlePriceRangeChange = useCallback(
    (e) => {
      const range = e.target.value.split("-").map(Number);
      if (range.length === 2) {
        setPriceRange(range);
      }
    },
    [setPriceRange]
  );
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePreviousPage = () => {
    handlePageChange(page - 1);
  };

  const handleNextPage = () => {
    handlePageChange(page + 1);
  };

  return (
    <div className="container mx-auto min-h-[calc(100vh-188px)] m-4">
      <div className="flex lg:flex-row flex-col justify-between gap-8 px-5 pb-10">
        <div className="lg:w-1/4 w-full lg:h-[calc(100vh-132px)] border p-4 rounded-xl lg:sticky static top-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <div>
            <label className="block mb-2">Brand</label>
            <select
              value={brand}
              onChange={handleBrandChange}
              className="block w-full mb-4 p-2 border rounded outline-none"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Category</label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="block w-full mb-4 p-2 border rounded outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Price Range</label>
            <select
              onChange={handlePriceRangeChange}
              className="block w-full p-2 border rounded outline-none"
            >
              <option value="0-20000">All Prices</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
            </select>
          </div>
        </div>

        <div className="lg:w-3/4 w-full">
          {/* filter */}
          <div className="flex justify-center pb-6 sticky top-4 z-10">
            <button
              className="join-item btn-square btn rounded-r-none border-none"
              disabled={page === 1 || isLoading}
              onClick={handlePreviousPage}
            >
              «
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                className={`${
                  page === index + 1 ? "active" : ""
                } join-item btn rounded-none btn-square border-none`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="join-item btn-squar btn rounded-l-none"
              disabled={page === totalPages || isLoading}
              onClick={handleNextPage}
            >
              »
            </button>
          </div>

          {isLoading ? (
            <div className="text-center lg:h-[calc(100vh-188px)] flex items-center justify-center">
              <Watch
                visible={true}
                height="80"
                width="80"
                radius="48"
                color="#4fa94d"
                ariaLabel="watch-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : products.length === 0 ? (
            <div className="md:h-[30vh] flex justify-center items-center">
              <p className="text-lg">Nothing Found</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 md:gap-5 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default Products;
