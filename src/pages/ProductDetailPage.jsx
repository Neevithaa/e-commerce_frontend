import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const buyNowHandler = () => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
      );
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow max-w-4xl w-full grid md:grid-cols-2 gap-8">
        <img
          src={
            `${import.meta.env.VITE_API_URL}${product.image}` ||
            "https://picsum.photos/300"
          }
          alt={product.name}
          className="w-full h-120 object-cover rounded"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-2xl font-semibold mb-6">₹ {product.price}</p>

          <div className="flex gap-4">
            <button
              onClick={() => addToCart(product, 1)}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full"
            >
              Add To Cart
            </button>

            <button
              onClick={buyNowHandler}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition w-full"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
