import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState(() => {
    const items = localStorage.getItem("cartItems");
    return items ? JSON.parse(items) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
  setCartItems((prevItems) => {
    const existItem = prevItems.find((x) => x._id === product._id);

    if (existItem) {
      return prevItems.map((x) =>
        x._id === product._id ? { ...x, qty: x.qty + 1 } : x
      );
    } else {
      return [...prevItems, { ...product, qty: 1 }];
    }
  });
};

 const removeFromCart = (id) => {
  setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
};
 const updateQty = (id, qty) => {
  setCartItems((prevItems) =>
    prevItems.map((item) =>
      item._id === id ? { ...item, qty } : item
    )
  );
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQty
      }}
    >
      {children}
    </CartContext.Provider>
  );
};