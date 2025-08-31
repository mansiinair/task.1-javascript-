import ProductCard from "./components/ProductCard";

const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 4999,
    image: "https://m.media-amazon.com/images/I/716ev66fkBL._SL1500_.jpg",
  },
  {
    id: 2,
    title: "Smartwatch",
    description: "Track your fitness and notifications",
    price: 2999,
    image: "https://m.media-amazon.com/images/I/614pTKzcPiL._SL1500_.jpg",
  },
  {
    id: 3,
    title: "Gaming Mouse",
    description: "Ergonomic design with RGB lighting",
    price: 1999,
    image: "https://m.media-amazon.com/images/I/51UtqOFkheL._SL1500_.jpg",
  },
  {
    id: 4,
    title: "Mechanical Keyboard",
    description: "Blue switches, compact layout",
    price: 3499,
    image: "https://m.media-amazon.com/images/I/61cvMO-HeeL._SL1500_.jpg",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛍️ Product List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
