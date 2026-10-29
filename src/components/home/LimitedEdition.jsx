import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProductCard from "../product/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import api, { getImageUrl } from "@/lib/api";

const LimitedEdition = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchLimited = async () => {
      try {
        const response = await api.products.list({ perPage: 8, limited: true });
        
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
        console.error("Failed to fetch limited edition products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLimited();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#C41230]" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2 text-surface-900 dark:text-white uppercase tracking-tight font-bold">
              LIMITED EDITION
            </h2>
            <p className="text-muted-foreground text-lg">
              Exclusive drops, available for a short time only
            </p>
          </div>
          <Link
            to="/category/all"
            className="text-sm font-bold tracking-widest uppercase border-b-2 border-black pb-1 hover:text-[#C41230] hover:border-[#C41230] transition-colors"
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
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="pl-3 md:pl-4 basis-[60%] sm:basis-[45%] md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} index={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-0 lg:-left-12 bg-white border-none shadow-md hover:bg-gray-50" />
          <CarouselNext className="hidden md:flex right-0 lg:-right-12 bg-white border-none shadow-md hover:bg-gray-50" />
        </Carousel>
      </div>
    </section>
  );
};

export default LimitedEdition;
