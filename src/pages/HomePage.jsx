import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome to E-Shop
        </h1>
        <p className="mt-4 text-lg">
          Big Deals. Best Prices. Limited Time Offers!
        </p>
      </div>

      {/* Promotions Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-yellow-400 text-black p-6 rounded-lg text-center font-semibold">
          🎉 Flat 20% Off on Selected Products!
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <h2 className="text-2xl font-bold mb-6">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;