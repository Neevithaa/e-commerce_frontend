import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function OrderSummary() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Loading order...</h2>
      </div>
    );

  const steps = [
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStep = steps.indexOf(order.trackingStatus);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">

        {/* Order Success */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600">
            🎉 Order Confirmed
          </h1>
          <p className="text-gray-600 mt-1">
            Order ID: <span className="font-semibold">{order._id}</span>
          </p>
        </div>

        {/* Tracking */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>

          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div key={step} className="flex-1 text-center relative">
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white
                  ${
                    index <= currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>

                <p className="mt-2 text-sm">{step}</p>

                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-full w-full h-1
                    ${
                      index < currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-3">
              Shipping Address
            </h2>

            <p className="text-gray-700">
              {order.shippingAddress.fullName}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress.address}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-700">
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h2 className="text-lg font-semibold mb-3">
              Payment Summary
            </h2>

            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>₹{order.itemsPrice}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹{order.shippingPrice}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>

          <div className="divide-y">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.qty}
                  </p>
                </div>

                <div className="font-semibold">
                  ₹{item.price * item.qty}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderSummary;