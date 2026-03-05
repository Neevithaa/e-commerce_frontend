import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty } =
    useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Shopping Cart
      </h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
          >
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {item.name}
              </h2>
              <p className="text-gray-500">
                ₹ {item.price}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQty(item._id, Math.max(1, item.qty - 1))
                }
                className="px-3 py-1 bg-gray-300 rounded"
              >
                -
              </button>

              <span className="px-2">{item.qty}</span>

              <button
                onClick={() =>
                  updateQty(item._id, item.qty + 1)
                }
                className="px-3 py-1 bg-gray-300 rounded"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div className="w-24 text-right font-semibold">
              ₹ {item.price * item.qty}
            </div>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total Section */}
      <div className="mt-8 border-t pt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Total: ₹ {totalPrice}
        </h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}