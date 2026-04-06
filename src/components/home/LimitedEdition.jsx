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
import jeansBlackSkinny from "@/assets/jeans-black-skinny.jpg";
import jeansBlueRipped from "@/assets/jeans-blue-ripped.jpg";
import pantsNavyCargo from "@/assets/pants-navy-cargo.jpg";
import shortsBlackAthletic from "@/assets/shorts-black-athletic.jpg";
const products = [
  {
    id: "101",
    name: "Midnight Skinny",
    category: "Jeans",
    price: 3499,
    originalPrice: 3999,
    image: jeansBlackSkinny,
    fit: "Skinny",
    isNew: true,
    path: "/product/midnight-skinny"
  },
  {
    id: "102",
    name: "Urban Ripped",
    category: "Jeans",
    price: 3299,
    image: jeansBlueRipped,
    fit: "Slim",
    isNew: false,
    path: "/product/urban-ripped"
  },
  {
    id: "103",
    name: "Tactical Cargo",
    category: "Pants",
    price: 2799,
    image: pantsNavyCargo,
    fit: "Regular",
    isNew: true,
    path: "/product/tactical-cargo"
  },
  {
    id: "104",
    name: "Pro Athletic",
    category: "Shorts",
    price: 1999,
    originalPrice: 2299,
    image: shortsBlackAthletic,
    fit: "Athletic",
    isNew: false,
    path: "/product/pro-athletic"
  },
  {
    id: "105",
    name: "Midnight Skinny",
    category: "Jeans",
    price: 3499,
    originalPrice: 3999,
    image: jeansBlackSkinny,
    fit: "Skinny",
    isNew: true,
    path: "/product/midnight-skinny"
  },
  {
    id: "106",
    name: "Urban Ripped",
    category: "Jeans",
    price: 3299,
    image: jeansBlueRipped,
    fit: "Slim",
    isNew: false,
    path: "/product/urban-ripped"
  },
  {
    id: "107",
    name: "Tactical Cargo",
    category: "Pants",
    price: 2799,
    image: pantsNavyCargo,
    fit: "Regular",
    isNew: true,
    path: "/product/tactical-cargo"
  },
  {
    id: "108",
    name: "Pro Athletic",
    category: "Shorts",
    price: 1999,
    originalPrice: 2299,
    image: shortsBlackAthletic,
    fit: "Athletic",
    isNew: false,
    path: "/product/pro-athletic"
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
    className="group p-3 rounded-2xl border border-transparent hover:border-border/50 hover:bg-background/50 transition-all duration-300"
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
            <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
              LIMITED
            </span>
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
const LimitedEdition = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <section ref={ref} className="py-20 lg:py-32 bg-secondary/30">
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
              LIMITED EDITION
            </h2>
            <p className="text-muted-foreground text-lg">
              Exclusive drops, available for a short time only
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
var stdin_default = LimitedEdition;
export {
  stdin_default as default
};
