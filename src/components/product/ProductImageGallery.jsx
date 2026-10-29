import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import ImageZoom from "./ImageZoom";

const ProductImageGallery = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Combine main image with gallery images
  const productImages = [
    product.image,
    ...(product.gallery || [])
  ].filter(Boolean);

  const isLiked = isFavorite(parseInt(product.id));

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      removeFromFavorites(parseInt(product.id));
    } else {
      addToFavorites({
        ...product,
        id: parseInt(product.id),
        price: `₹${parseFloat(product.price).toLocaleString("en-IN")}`
      });
    }
  };

  const handleImageClick = (index) => {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      {/* Desktop: Thumbnails on the left */}
      <div className="hidden lg:flex flex-col gap-3 w-20 flex-shrink-0">
        {productImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`aspect-[3/4] border-2 overflow-hidden transition-all ${
              index === currentImageIndex ? "border-black" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={image}
              alt={`${product.name} thumb ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div className="flex-1 relative group">
        <div 
          className="aspect-[3/4] bg-[#F2F2F2] overflow-hidden cursor-zoom-in relative"
          onClick={() => handleImageClick(currentImageIndex)}
        >
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={productImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* New Tag */}
          {product.is_new && (
            <div className="absolute top-0 left-0 bg-white px-3 py-1.5 shadow-sm">
              <span className="text-xs font-bold tracking-tight text-black">New</span>
            </div>
          )}

          {/* Wishlist Icon */}
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm transition-transform hover:scale-110 z-10"
          >
            <Heart 
              size={24} 
              className={`${isLiked ? "fill-[#C41230] text-[#C41230]" : "text-black"}`} 
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Mobile Thumbnails (Horizontal Scroll) */}
        <div className="flex lg:hidden gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 aspect-[3/4] border-2 overflow-hidden ${
                index === currentImageIndex ? "border-black" : "border-transparent opacity-60"
              }`}
            >
              <img
                src={image}
                alt={`${product.name} mobile thumb ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoom
        images={productImages}
        initialIndex={zoomInitialIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
};

export default ProductImageGallery;
