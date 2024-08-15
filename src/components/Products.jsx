import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollRestoration } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/products?page=${page}&limit=8`)
      .then((response) => {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [page]);

  return (
    <div className="md:px-32 px-4 pb-6 pt-4">
      <div className="container mx-auto">
        <h1 className="text-5xl font-semibold text-center pt-5 pb-8">
          Our Products
        </h1>
        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="card glass w-auto">
              <figure>
                <img
                  className="h-56 w-full"
                  src={product.productImage}
                  alt="car!"
                />
              </figure>
              <div className="card-body p-7">
                <div className="flex justify-between items-center">
                  <h2 className="card-title">{product.productName}</h2>
                  <div className="badge badge-ghost">{product.brandName}</div>
                </div>
                <p className="text-[15px]">
                  {product.description.split(" ").slice(0, 12).join(" ")}
                </p>
                <p className="text-[1.25rem] font-semibold">${product.price}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Learn now!</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ScrollRestoration />

        {/* pagination button */}
        <div className="join flex justify-center pt-6">
          <button
            className="join-item btn"
            disabled={page === 1}
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
            />
          ))}
          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
