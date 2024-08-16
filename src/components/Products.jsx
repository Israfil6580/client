import { useContext } from "react";
import { ScrollRestoration } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { ThreeCircles } from "react-loader-spinner";
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

  return (
    <div className="md:px-32 px-4 pb-6 pt-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-semibold text-center pt-5 pb-8">
          Our Products
        </h1>
        <div className="flex justify-end">
          {/* Filter Controls */}
          <div className="flex space-x-4 mb-6">
            <select
              className="border rounded-md p-2 outline-none"
              onChange={(e) => setBrand(e.target.value)}
              value={brand}
              disabled={isLoading}
            >
              <option value="">All Brands</option>
              {brands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              className="border rounded-md p-2 outline-none"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              disabled={isLoading}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="border rounded-md p-2 outline-none"
              onChange={(e) =>
                setPriceRange(e.target.value.split("-").map(Number))
              }
              disabled={isLoading}
            >
              <option value="0-20000">All Prices</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-2000">$1000 - $2000</option>
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-[20vh]">
            <ThreeCircles
              visible={true}
              height="100"
              width="100"
              color="#D7CF07"
              ariaLabel="three-circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )}

        {/* No Products Found */}
        {!isLoading && products.length === 0 && (
          <div className="flex justify-center items-center h-[20vh]">
            <p className="text-xl font-semibold">Nothing Found</p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product._id} className="card glass w-auto">
                <figure>
                  <img
                    className="h-56 w-full"
                    src={product.productImage}
                    alt={product.productName}
                  />
                </figure>
                <div className="card-body p-7 pt-5">
                  <div className="flex justify-between items-center">
                    <h2 className="card-title">{product.productName}</h2>
                    <div className="badge badge-ghost">{product.brandName}</div>
                  </div>
                  <p className="text-[15px]">
                    {product.description.split(" ").slice(0, 12).join(" ")}
                  </p>
                  <p className="text-[15px]">
                    {new Date(product.creationDate).toLocaleString()}
                  </p>
                  <p className="text-[1.25rem] font-semibold">
                    ${product.price}
                  </p>

                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <input
                        key={index}
                        type="radio"
                        name={`rating-${product._id}`} // Unique name for each product
                        className={`mask mask-star-2 bg-orange-400 ${
                          index < Math.round(product.rating) ? "checked" : ""
                        }`}
                        readOnly
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold">
                      {(Number(product.rating) || 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Learn now!</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <div className="join flex justify-center pt-6">
            <button
              className="join-item btn"
              disabled={page === 1 || isLoading}
              onClick={() => setPage(page - 1)}
            >
              «
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <input
                key={index + 1}
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={index + 1}
                checked={page === index + 1}
                onChange={() => setPage(index + 1)}
                disabled={isLoading}
              />
            ))}
            <button
              className="join-item btn"
              disabled={page === totalPages || isLoading}
              onClick={() => setPage(page + 1)}
            >
              »
            </button>
          </div>
        )}
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default Products;
