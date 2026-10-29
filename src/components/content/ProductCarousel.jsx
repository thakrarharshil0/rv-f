import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import api, { getImageUrl } from "@/lib/api";

const ProductCarousel = ({ category, excludeId }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await api.products.list({ 
          category: category,
          perPage: 10 
        });
        const filtered = (response.items || [])
          .filter(p => p.id !== excludeId)
          .map(p => ({
            ...p,
            image: getImageUrl(p.image),
            priceFormatted: `₹${parseFloat(p.price).toLocaleString("en-IN")}`
          }));
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (category) fetchRelated();
  }, [category, excludeId]);

  const toggleFavorite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-admin-primary-600" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full mb-16 px-6">
      <Carousel
        opts={{
          align: "start",
          loop: false
        }}
        className="w-full"
      >
        <CarouselContent className="">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link to={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-[3/4] mb-3 overflow-hidden bg-muted/10 relative rounded-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/[0.02]" />
                      <button
                        onClick={(e) => toggleFavorite(e, product)}
                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-black hover:bg-white transition-all duration-300 z-10 shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          size={16}
                          className={isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-black"}
                        />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                        {product.category}
                      </p>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-admin-primary-600 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm font-bold text-foreground">
                          {product.priceFormatted}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
