import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
import api, { getImageUrl } from "@/lib/api";
import ProductCard from "../product/ProductCard";
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        let response = await api.products.list({ perPage: 8, featured: true });
        
        // Fallback: If no featured products, get latest products
        if (!response.items || response.items.length === 0) {
          response = await api.products.list({ perPage: 8 });
        }

        const mapped = (response.items || []).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          image: getImageUrl(p.image),
          fit: p.fit || "Regular",
          isNew: p.isNew,
          path: `/product/${p.id}`
        }));
        setProducts(mapped);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-denim" />
        </div>
      </section>
    );
  }

  return <section ref={ref} className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2 text-surface-900 dark:text-white uppercase">
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

export default FeaturedProducts;
