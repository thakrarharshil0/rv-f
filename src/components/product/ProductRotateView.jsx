import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
const ProductRotateView = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const handleRotate = () => {
    setIsRotating(true);
    let index = currentIndex;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentIndex(index);
      if (index === currentIndex) {
        clearInterval(interval);
        setIsRotating(false);
      }
    }, 300);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  return <div className="relative">
      {
    /* Main Image */
  }
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
        <AnimatePresence mode="wait">
          <motion.img
    key={currentIndex}
    src={images[currentIndex]}
    alt={`${productName} - View ${currentIndex + 1}`}
    className="absolute inset-0 w-full h-full object-cover"
    initial={{ opacity: 0, scale: 1.05 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  />
        </AnimatePresence>

        {
    /* Controls Overlay */
  }
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
          <button
    onClick={handlePrev}
    className="p-3 bg-white/90 text-foreground rounded-full shadow-lg hover:bg-white transition-colors"
    disabled={isRotating}
  >
            <ChevronLeft size={20} />
          </button>
          <button
    onClick={handleNext}
    className="p-3 bg-white/90 text-foreground rounded-full shadow-lg hover:bg-white transition-colors"
    disabled={isRotating}
  >
            <ChevronRight size={20} />
          </button>
        </div>

        {
    /* Bottom Controls */
  }
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <motion.button
    onClick={handleRotate}
    disabled={isRotating}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center gap-2 px-4 py-2 bg-white/90 text-foreground text-sm font-medium rounded-full shadow-lg hover:bg-white transition-colors ${isRotating ? "animate-pulse" : ""}`}
  >
            <RotateCcw size={16} className={isRotating ? "animate-spin" : ""} />
            360° View
          </motion.button>
          <button className="p-2 bg-white/90 text-foreground rounded-full shadow-lg hover:bg-white transition-colors">
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {
    /* Thumbnail Navigation */
  }
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {images.map((image, index) => <button
    key={index}
    onClick={() => setCurrentIndex(index)}
    className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${index === currentIndex ? "border-denim" : "border-transparent hover:border-border"}`}
  >
            <img
    src={image}
    alt={`Thumbnail ${index + 1}`}
    className="w-full h-full object-cover"
  />
          </button>)}
      </div>
    </div>;
};
var stdin_default = ProductRotateView;
export {
  stdin_default as default
};
