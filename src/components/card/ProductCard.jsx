/* eslint-disable react/prop-types */
import StarRating from "../ratings/StarRating";
const ProductCard = ({ product }) => {
  return (
    <div className="card glass w-auto relative rounded-xl">
      <figure>
        <img
          className="lg:h-60 h-80 w-full object-cover"
          src={product.productImage}
          alt={product.productName}
        />
      </figure>
      <div className="card-body px-6 py-5 ">
        <div className="flex justify-between">
          <h2 className="card-title">{product.productName}</h2>
          <div className="badge badge-ghost">{product.brandName}</div>
        </div>
        <p>{product.description.split(" ").slice(0, 9).join(" ")}</p>
        <p className="text-[15px]">
          {new Date(product.creationDate).toLocaleString()}
        </p>
        <StarRating rating={product.ratings} />
        <h2 className="card-title">Price - ${product.price}</h2>
      </div>
    </div>
  );
};

export default ProductCard;
