export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 w-[420px] hover:scale-105 transform transition duration-300">
      <img
        src={product.image}
        alt={product.title}
        className="w-[400px] h-[300px] object-cover rounded-lg mx-auto"
      />
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold">{product.title}</h2>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">
          ₹{product.price}
        </p>
        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
