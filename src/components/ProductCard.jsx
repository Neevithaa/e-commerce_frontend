import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition duration-300 p-4 flex flex-col">
      
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={`${import.meta.env.VITE_API_URL}${product.image}`|| "https://picsum.photos/300"}
          alt={product.name}
          className="h-48 w-full object-contain mb-4"
        />
      </Link>

      {/* Product Name */}
      <Link to={`/product/${product._id}`}>
        <h3 className="text-md font-semibold hover:text-blue-600 line-clamp-2">
          {product.name}
        </h3>
      </Link>

      {/* Price */}
      <p className="text-lg font-bold text-gray-900 mt-2">
        ₹ {product.price}
      </p>

      {/* Buttons */}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <button
          onClick={() => addToCart(product, 1)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;