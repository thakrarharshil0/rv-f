import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import jeansSlim from "@/assets/jeans-slim.jpg";
import jeansRelaxed from "@/assets/jeans-relaxed.jpg";
import tracksBlack from "@/assets/tracks-black.jpg";
import shortsBeige from "@/assets/shorts-beige.jpg";
const products = [
  {
    id: "1",
    name: "Essential Slim Fit",
    category: "Jeans",
    price: 2499,
    originalPrice: 2999,
    image: jeansSlim,
    fit: "Slim",
    isNew: true,
    path: "/product/essential-slim-fit"
  },
  {
    id: "2",
    name: "Weekend Relaxed",
    category: "Jeans",
    price: 2299,
    image: jeansRelaxed,
    fit: "Relaxed",
    isNew: false,
    path: "/product/weekend-relaxed"
  },
  {
    id: "3",
    name: "Street Runner",
    category: "Tracks",
    price: 1799,
    image: tracksBlack,
    fit: "Regular",
    isNew: true,
    path: "/product/street-runner"
  },
  {
    id: "4",
    name: "Summer Essential",
    category: "Shorts",
    price: 1499,
    originalPrice: 1799,
    image: shortsBeige,
    fit: "Regular",
    isNew: false,
    path: "/product/summer-essential"
  },
  {
    id: "5",
    name: "Essential Slim Fit",
    category: "Jeans",
    price: 2499,
    originalPrice: 2999,
    image: jeansSlim,
    fit: "Slim",
    isNew: true,
    path: "/product/essential-slim-fit"
  },
  {
    id: "6",
    name: "Weekend Relaxed",
    category: "Jeans",
    price: 2299,
    image: jeansRelaxed,
    fit: "Relaxed",
    isNew: false,
    path: "/product/weekend-relaxed"
  },
  {
    id: "7",
    name: "Street Runner",
    category: "Tracks",
    price: 1799,
    image: tracksBlack,
    fit: "Regular",
    isNew: true,
    path: "/product/street-runner"
  },
  {
    id: "8",
    name: "Summer Essential",
    category: "Shorts",
    price: 1499,
    originalPrice: 1799,
    image: shortsBeige,
    fit: "Regular",
    isNew: false,
    path: "/product/summer-essential"
  }
];
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const productForContext = {
    ...product,
    id: parseInt(product.id),
    price: `\u20B9${product.price.toLocaleString()}`
    // Context might expect formatted price string or different type, adjusting based on valid usage
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
  return <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group p-3 rounded-2xl border border-transparent hover:border-border/50 hover:bg-secondary/30 transition-all duration-300"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
      <Link to={product.path} className="block">
        {
    /* Image Container */
  }
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary mb-3">
          <img
    src={product.image}
    alt={product.name}
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
  />

          {
    /* Badges */
  }
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <span className="px-3 py-1 bg-denim text-white text-xs font-medium rounded-full">
                NEW
              </span>}
            {product.originalPrice && <span className="px-3 py-1 bg-destructive text-white text-xs font-medium rounded-full">
                SALE
              </span>}
          </div>

          {
    /* Quick Actions */
  }
          <AnimatePresence>
            {isHovered && <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    className="absolute bottom-3 left-3 right-3 flex gap-2"
  >
                <button
    onClick={(e) => {
      e.preventDefault();
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: "M"
        // Default size for quick add
      });
    }}
    className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
  >
                  <ShoppingBag size={16} />
                  Quick Add
                </button>
                <button
    onClick={toggleFavorite}
    className={`p-3 rounded-lg transition-colors ${isLiked ? "bg-white text-red-500" : "bg-white text-foreground hover:bg-secondary"}`}
    aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
  >
                  <Heart size={16} className={isLiked ? "fill-current" : ""} />
                </button>
              </motion.div>}
          </AnimatePresence>
        </div>

        {
    /* Product Info */
  }
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-denim font-medium">{product.fit} Fit</span>
          </div>
          <h3 className="font-medium mb-2 group-hover:text-denim transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-muted-foreground line-through text-sm">
                ₹{product.originalPrice.toLocaleString()}
              </span>}
          </div>
        </div>
      </Link>
    </motion.div>;
};
const FeaturedProducts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <section ref={ref} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        {
    /* Section Header */
  }
        <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6 }}
    className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
  >
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
              BESTSELLERS
            </h2>
            <p className="text-muted-foreground text-lg">
              Our most-loved styles, handpicked for you
            </p>
          </div>
          <Link
    to="/category/all"
    className="text-sm font-medium tracking-wide link-underline self-start md:self-auto"
  >
            View All Products
          </Link>
        </motion.div>

        {
    /* Products Grid */
  }
        <Carousel
    opts={{
      align: "start",
      dragFree: true
    }}
    plugins={[WheelGesturesPlugin()]}
    className="w-full"
  >
          <CarouselContent className="-ml-3 md:-ml-4">
            {products.map((product, index) => <CarouselItem key={product.id} className="pl-3 md:pl-4 basis-[60%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} index={index} />
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="left-0 lg:-left-12" />
          <CarouselNext className="right-0 lg:-right-12" />
        </Carousel>
      </div>
    </section>;
};
var stdin_default = FeaturedProducts;
export {
  stdin_default as default
};
