/* eslint-disable react/prop-types */
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="rating rating-lg rating-half items-center">
      {[...Array(totalStars)].map((_, index) => {
        const isFullStar = index < fullStars;
        const isHalfStar = index === fullStars && halfStar;

        return (
          <input
            key={index}
            type="radio"
            name={`rating-${index}`}
            className={`mask mask-star-2 ${
              isFullStar ? "mask-full bg-green-500" : ""
            } ${
              isHalfStar ? "mask-half bg-green-500" : "mask-empty bg-gray-300"
            }`}
            disabled
          />
        );
      })}
      <span className="ml-2 text-[15px] font-semibold">
        {(Number(rating) || 0).toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
