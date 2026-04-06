import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import jeansBlackSkinny from "@/assets/jeans-black-skinny.jpg";
import jeansBlueDark from "@/assets/jeans-blue-dark.jpg";
import jeansBlueRipped from "@/assets/jeans-blue-ripped.jpg";
import shortsBlackAthletic from "@/assets/shorts-black-athletic.jpg";
import shortsBeigeCargo from "@/assets/shorts-beige-cargo.jpg";
import shortsDenimBlue from "@/assets/shorts-denim-blue.jpg";
import pantsBlackTrack from "@/assets/pants-black-track.jpg";
import pantsGreyJoggers from "@/assets/pants-grey-joggers.jpg";
import pantsNavyCargo from "@/assets/pants-navy-cargo.jpg";
const products = [
  {
    id: 1,
    name: "Classic Skinny",
    category: "Jeans",
    price: "\u20B92,499",
    image: jeansBlackSkinny
  },
  {
    id: 2,
    name: "Dark Wash Slim",
    category: "Jeans",
    price: "\u20B92,999",
    image: jeansBlueDark
  },
  {
    id: 3,
    name: "Distressed Blue",
    category: "Jeans",
    price: "\u20B93,299",
    image: jeansBlueRipped
  },
  {
    id: 4,
    name: "Athletic Performance",
    category: "Shorts",
    price: "\u20B91,499",
    image: shortsBlackAthletic
  },
  {
    id: 5,
    name: "Cargo Utility",
    category: "Shorts",
    price: "\u20B91,899",
    image: shortsBeigeCargo
  },
  {
    id: 6,
    name: "Denim Cutoffs",
    category: "Shorts",
    price: "\u20B91,299",
    image: shortsDenimBlue
  },
  {
    id: 7,
    name: "Track Essentials",
    category: "Pants",
    price: "\u20B91,999",
    image: pantsBlackTrack
  },
  {
    id: 8,
    name: "Cotton Joggers",
    category: "Pants",
    price: "\u20B91,599",
    image: pantsGreyJoggers
  },
  {
    id: 9,
    name: "Technical Cargo",
    category: "Pants",
    price: "\u20B92,499",
    image: pantsNavyCargo
  }
];
const ProductCarousel = () => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const toggleFavorite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  return <section className="w-full mb-16 px-6">
      <Carousel
    opts={{
      align: "start",
      loop: false
    }}
    className="w-full"
  >
        <CarouselContent className="">
          {products.map((product) => <CarouselItem
    key={product.id}
    className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
  >
              <Link to={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                      <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-105"
  />
                      <div className="absolute inset-0 bg-black/[0.03]" />
                      {(product.id === 1 || product.id === 3) && <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                          NEW
                        </div>}

                      <button
    onClick={(e) => toggleFavorite(e, product)}
    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-black hover:bg-white transition-colors z-10"
    aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
  >
                        <Heart
    size={18}
    className={isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-black"}
  />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-light text-foreground">
                        {product.category}
                      </p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm font-light text-foreground">
                          {product.price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>)}
        </CarouselContent>
      </Carousel>
    </section>;
};
var stdin_default = ProductCarousel;
export {
  stdin_default as default
};
