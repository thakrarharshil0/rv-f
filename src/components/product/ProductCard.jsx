import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const productForContext = {
    ...product,
    id: parseInt(product.id),
    price: `₹${parseFloat(product.price).toLocaleString("en-IN")}`
  };
  
  const isLiked = isFavorite(parseInt(product.id));
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromFavorites(parseInt(product.id));
    } else {
      addToFavorites(productForContext);
    }
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={product.path || `/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F2F2] mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* New Tag */}
          {product.isNew && (
            <div className="absolute top-0 left-0 bg-white px-2 py-1 shadow-sm">
              <span className="text-[10px] font-bold tracking-tight text-black">New</span>
            </div>
          )}

          {/* Wishlist Icon */}
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-1.5 transition-transform hover:scale-110 z-10"
          >
            <Heart 
              size={20} 
              className={`${isLiked ? "fill-[#C41230] text-[#C41230]" : "text-black font-light opacity-60 group-hover:opacity-100"}`} 
              strokeWidth={1.5}
            />
          </button>

          {/* Quick Add overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 left-3 right-3"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({ ...product, size: "M" });
                  }}
                  className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  Quick Add
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-1">
          {/* Color Swatches (Dummy for design) */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-4 h-4 rounded-full bg-black border border-gray-300 ring-1 ring-offset-1 ring-black/20" />
            <div className="w-4 h-4 rounded-full bg-[#1E2D4A] border border-gray-300" />
            <div className="w-4 h-4 rounded-full bg-gray-400 border border-gray-300" />
          </div>

          <h3 className="text-[13px] font-medium text-black leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-black">₹{parseFloat(product.price).toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 line-through text-xs">₹{parseFloat(product.originalPrice).toLocaleString("en-IN")}</span>
                <span className="text-[#C41230] text-xs font-bold">{discount}% OFF</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
