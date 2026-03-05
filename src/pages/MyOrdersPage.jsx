import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderSummaryPage() {

  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setOrders(data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (

            <div
              key={order._id}
              className="bg-white p-6 mb-6 rounded-xl shadow"
            >

              {/* Order Info */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">
                    Order ID
                  </p>
                  <p className="text-gray-600">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    Payment
                  </p>
                  <p className="text-gray-600">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">
                    Total
                  </p>
                  <p className="text-green-600 font-bold">
                    ₹ {order.totalPrice}
                  </p>
                </div>
              </div>

              {/* Shipping */}
              <div className="mb-4">
                <p className="font-semibold">
                  Shipping Address
                </p>

                <p className="text-gray-600">
                  {order.shippingAddress.fullName}
                </p>

                <p className="text-gray-600">
                  {order.shippingAddress.address}
                </p>

                <p className="text-gray-600">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>

                <p className="text-gray-600">
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Ordered Items */}
              <div>

                <p className="font-semibold mb-3">
                  Items
                </p>

                {order.orderItems.map((item) => (

                  <div
                    key={item._id}
                    className="flex justify-between border-b py-2"
                  >

                    <span>
                      {item.name} × {item.qty}
                    </span>

                    <span>
                      ₹ {item.price * item.qty}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}