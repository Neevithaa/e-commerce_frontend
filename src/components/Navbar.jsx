import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useEffect, useState, useRef, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  //const [cartCount, setCartCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const { cartItems } = useContext(CartContext);
  const menuRef = useRef();

const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    //const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    setUser(storedUser);
    //setCartCount(cartItems.length);
  }, [location]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    setShowMenu(false)
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        E-Shop
      </Link>

      {!isAuthPage && (
        <div className="flex items-center space-x-6">

          {/* Home */}
          <Link to="/">Home</Link>

          {/* Products */}
          <Link to="/products">Products</Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
          <div className="relative" ref={menuRef}>              
          <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2"
              >
                <FaUser />
                {user.name}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                  <Link
                    to="/profile"
                     onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Account
                  </Link>

                  <Link
                    to="/myorders"
                     onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>

                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

        </div>
      )}
    </nav>
  );
}