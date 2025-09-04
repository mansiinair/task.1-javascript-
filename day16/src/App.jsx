import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowCart(true); // Open cart automatically when adding
  };

  // Update quantity
  const updateQuantity = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Checkout placeholder
  const checkout = () => {
    alert("Checkout feature coming soon 🚀");
  };

  // Filter products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛍️ My E-commerce Store</h1>
        <button
          onClick={() => setShowCart(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Cart 🛒 ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </header>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-6"
      />

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            whileHover={{ scale: 1.03 }}
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-3 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
            >
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 z-50"
          >
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
            >
              ❌
            </button>

            {cart.length > 0 ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center mb-3"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p>${item.price}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="bg-gray-300 px-2 rounded"
                        >
                          ➖
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, +1)}
                          className="bg-gray-300 px-2 rounded"
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total price */}
                <div className="mt-4 border-t pt-4">
                  <p className="text-lg font-bold">
                    Total: $
                    {cart
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <button
                    onClick={checkout}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Checkout
                  </button>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-2 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Continue Shopping 🛍️
                  </button>
                </div>
              </div>
            ) : (
              <p>Your cart is empty 🛒</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
