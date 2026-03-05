import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CheckoutPage() {
  const { cartItems,setCartItems} = useContext(CartContext);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingCost = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Check if address is complete
  const isShippingFilled =
    shipping.fullName &&
    shipping.address &&
    shipping.city &&
    shipping.postalCode &&
    shipping.country;

  const placeOrderHandler = async () => {
    if (!isShippingFilled) {
      setError("⚠️ Please fill all shipping details before placing the order.");
      return;
    }

    try {
      localStorage.setItem("shippingInfo", JSON.stringify(shipping));

      // ===============================
      // CASH ON DELIVERY
      // ===============================
      if (paymentMethod === "COD") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/orders`,
          {
            orderItems: cartItems,
            shippingAddress: shipping,
            paymentMethod: "COD",
            itemsPrice: subtotal,
            shippingPrice: shippingCost,
            totalPrice: total,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        localStorage.removeItem("cartItems");

        navigate("/orders");
      }

      // ===============================
      // CARD PAYMENT (RAZORPAY)
      // ===============================
      if (paymentMethod === "Card") {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/orders/razorpay`,
          { amount: total },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "E-Shop",
          description: "Order Payment",
          order_id: data.id,

         handler: async function () {

  const { data: createdOrder} = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/orders`,
    {
      orderItems: cartItems,
      shippingAddress: shipping,
      paymentMethod: "Card",
      itemsPrice: subtotal,
      shippingPrice: shippingCost,
      totalPrice: total,
    },
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );

  setCartItems([]);
  localStorage.removeItem("cartItems");

  // use MongoDB order id
  navigate(`/order/${createdOrder._id}`);
}
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* SHIPPING */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            Shipping Information
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="w-full border px-4 py-2 rounded"
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Payment Method
          </h2>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit / Debit Card
            </label>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between"
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹ {item.price * item.qty}</span>
              </div>
            ))}

            <hr />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingCost === 0
                  ? "Free"
                  : `₹ ${shippingCost}`}
              </span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
          </div>

          <button
            onClick={placeOrderHandler}
            disabled={!isShippingFilled}
            className={`w-full mt-6 py-3 rounded-lg text-white ${
              isShippingFilled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}