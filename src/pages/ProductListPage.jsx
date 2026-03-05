import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // 🔍 Filtering
  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // 🔄 Sorting
  if (sort === "lowToHigh") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "highToLow") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header Section */}
      <div className="bg-white shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Explore Our Products
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full max-w-xl border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto px-6 gap-6">
        
        {/* Sidebar Filters */}
        <div className="w-64 bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-lg font-semibold mb-4">
            Filters
          </h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Category</h3>
            <select
              className="w-full border px-3 py-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <h3 className="font-medium mb-2">Sort By</h3>
            <select
              className="w-full border px-3 py-2 rounded"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Product Section */}
        <div className="flex-1">
          
          {/* Product Count */}
          <p className="mb-4 text-gray-600">
            {filteredProducts.length} products found
          </p>

          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              No products match your search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;