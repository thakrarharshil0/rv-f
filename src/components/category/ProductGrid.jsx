import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import Pagination from "./Pagination";
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
    image: jeansBlackSkinny,
    isNew: true
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
    image: jeansBlueRipped,
    isNew: true
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
    image: shortsDenimBlue,
    isNew: true
  },
  {
    id: 7,
    name: "Track Essentials",
    category: "Joggers",
    price: "\u20B91,999",
    image: pantsBlackTrack
  },
  {
    id: 8,
    name: "Cotton Joggers",
    category: "Joggers",
    price: "\u20B91,599",
    image: pantsGreyJoggers
  },
  {
    id: 9,
    name: "Technical Cargo",
    category: "Cargos",
    price: "\u20B92,499",
    image: pantsNavyCargo
  },
  {
    id: 10,
    name: "Smart Chinos",
    category: "Trousers",
    price: "\u20B92,299",
    image: pantsGreyJoggers
    // Reusing existing image as placeholder
  },
  {
    id: 11,
    name: "Pleated Formal",
    category: "Formal Trouser",
    price: "\u20B92,999",
    image: pantsBlackTrack
    // Reusing existing image as placeholder
  },
  // Duplicates for "More Content" as requested
  {
    id: 12,
    name: "Classic Skinny",
    category: "Jeans",
    price: "\u20B92,499",
    image: jeansBlackSkinny
  },
  {
    id: 13,
    name: "Dark Wash Slim",
    category: "Jeans",
    price: "\u20B92,999",
    image: jeansBlueDark
  },
  {
    id: 14,
    name: "Distressed Blue",
    category: "Jeans",
    price: "\u20B93,299",
    image: jeansBlueRipped
  },
  {
    id: 15,
    name: "Athletic Performance",
    category: "Shorts",
    price: "\u20B91,499",
    image: shortsBlackAthletic
  },
  {
    id: 16,
    name: "Cargo Utility",
    category: "Shorts",
    price: "\u20B91,899",
    image: shortsBeigeCargo
  },
  {
    id: 17,
    name: "Denim Cutoffs",
    category: "Shorts",
    price: "\u20B91,299",
    image: shortsDenimBlue
  },
  {
    id: 18,
    name: "Track Essentials",
    category: "Joggers",
    price: "\u20B91,999",
    image: pantsBlackTrack
  },
  {
    id: 19,
    name: "Cotton Joggers",
    category: "Joggers",
    price: "\u20B91,599",
    image: pantsGreyJoggers
  },
  {
    id: 20,
    name: "Premium Track",
    category: "Joggers",
    price: "\u20B92,199",
    image: pantsBlackTrack
  },
  {
    id: 21,
    name: "Technical Cargo",
    category: "Cargos",
    price: "\u20B92,499",
    image: pantsNavyCargo
  },
  {
    id: 22,
    name: "Utility Cargo",
    category: "Cargos",
    price: "\u20B92,299",
    image: pantsNavyCargo
  },
  {
    id: 23,
    name: "Street Cargo",
    category: "Cargos",
    price: "\u20B92,699",
    image: pantsNavyCargo
  },
  {
    id: 24,
    name: "Smart Chinos",
    category: "Trousers",
    price: "\u20B92,299",
    image: pantsGreyJoggers
  },
  {
    id: 25,
    name: "Office Chinos",
    category: "Trousers",
    price: "\u20B92,499",
    image: pantsGreyJoggers
  },
  {
    id: 26,
    name: "Casual Chinos",
    category: "Trousers",
    price: "\u20B92,199",
    image: pantsGreyJoggers
  },
  {
    id: 27,
    name: "Pleated Formal",
    category: "Formal Trouser",
    price: "\u20B92,999",
    image: pantsBlackTrack
  },
  {
    id: 28,
    name: "Classic Formal",
    category: "Formal Trouser",
    price: "\u20B93,499",
    image: pantsBlackTrack
  },
  {
    id: 29,
    name: "Modern Formal",
    category: "Formal Trouser",
    price: "\u20B93,199",
    image: pantsBlackTrack
  },
  // Additional Duplicates to reach 12 items (Full Page) for testing extra page logic
  // Jeans (Need 6 more)
  { id: 30, name: "Classic Skinny", category: "Jeans", price: "\u20B92,499", image: jeansBlackSkinny },
  { id: 31, name: "Dark Wash Slim", category: "Jeans", price: "\u20B92,999", image: jeansBlueDark },
  { id: 32, name: "Distressed Blue", category: "Jeans", price: "\u20B93,299", image: jeansBlueRipped },
  { id: 33, name: "Classic Skinny", category: "Jeans", price: "\u20B92,499", image: jeansBlackSkinny },
  { id: 34, name: "Dark Wash Slim", category: "Jeans", price: "\u20B92,999", image: jeansBlueDark },
  { id: 35, name: "Distressed Blue", category: "Jeans", price: "\u20B93,299", image: jeansBlueRipped },
  // Shorts (Need 6 more)
  { id: 36, name: "Athletic Performance", category: "Shorts", price: "\u20B91,499", image: shortsBlackAthletic },
  { id: 37, name: "Cargo Utility", category: "Shorts", price: "\u20B91,899", image: shortsBeigeCargo },
  { id: 38, name: "Denim Cutoffs", category: "Shorts", price: "\u20B91,299", image: shortsDenimBlue },
  { id: 39, name: "Athletic Performance", category: "Shorts", price: "\u20B91,499", image: shortsBlackAthletic },
  { id: 40, name: "Cargo Utility", category: "Shorts", price: "\u20B91,899", image: shortsBeigeCargo },
  { id: 41, name: "Denim Cutoffs", category: "Shorts", price: "\u20B91,299", image: shortsDenimBlue },
  // Joggers (Need 7 more)
  { id: 42, name: "Track Essentials", category: "Joggers", price: "\u20B91,999", image: pantsBlackTrack },
  { id: 43, name: "Cotton Joggers", category: "Joggers", price: "\u20B91,599", image: pantsGreyJoggers },
  { id: 44, name: "Premium Track", category: "Joggers", price: "\u20B92,199", image: pantsBlackTrack },
  { id: 45, name: "Track Essentials", category: "Joggers", price: "\u20B91,999", image: pantsBlackTrack },
  { id: 46, name: "Cotton Joggers", category: "Joggers", price: "\u20B91,599", image: pantsGreyJoggers },
  { id: 47, name: "Premium Track", category: "Joggers", price: "\u20B92,199", image: pantsBlackTrack },
  { id: 48, name: "Track Essentials", category: "Joggers", price: "\u20B91,999", image: pantsBlackTrack },
  // Cargos (Need 8 more)
  { id: 49, name: "Technical Cargo", category: "Cargos", price: "\u20B92,499", image: pantsNavyCargo },
  { id: 50, name: "Utility Cargo", category: "Cargos", price: "\u20B92,299", image: pantsNavyCargo },
  { id: 51, name: "Street Cargo", category: "Cargos", price: "\u20B92,699", image: pantsNavyCargo },
  { id: 52, name: "Technical Cargo", category: "Cargos", price: "\u20B92,499", image: pantsNavyCargo },
  { id: 53, name: "Utility Cargo", category: "Cargos", price: "\u20B92,299", image: pantsNavyCargo },
  { id: 54, name: "Street Cargo", category: "Cargos", price: "\u20B92,699", image: pantsNavyCargo },
  { id: 55, name: "Technical Cargo", category: "Cargos", price: "\u20B92,499", image: pantsNavyCargo },
  { id: 56, name: "Utility Cargo", category: "Cargos", price: "\u20B92,299", image: pantsNavyCargo },
  // Trousers (Need 8 more)
  { id: 57, name: "Smart Chinos", category: "Trousers", price: "\u20B92,299", image: pantsGreyJoggers },
  { id: 58, name: "Office Chinos", category: "Trousers", price: "\u20B92,499", image: pantsGreyJoggers },
  { id: 59, name: "Casual Chinos", category: "Trousers", price: "\u20B92,199", image: pantsGreyJoggers },
  { id: 60, name: "Smart Chinos", category: "Trousers", price: "\u20B92,299", image: pantsGreyJoggers },
  { id: 61, name: "Office Chinos", category: "Trousers", price: "\u20B92,499", image: pantsGreyJoggers },
  { id: 62, name: "Casual Chinos", category: "Trousers", price: "\u20B92,199", image: pantsGreyJoggers },
  { id: 63, name: "Smart Chinos", category: "Trousers", price: "\u20B92,299", image: pantsGreyJoggers },
  { id: 64, name: "Office Chinos", category: "Trousers", price: "\u20B92,499", image: pantsGreyJoggers },
  // Formal Trousers (Need 8 more)
  { id: 65, name: "Pleated Formal", category: "Formal Trouser", price: "\u20B92,999", image: pantsBlackTrack },
  { id: 66, name: "Classic Formal", category: "Formal Trouser", price: "\u20B93,499", image: pantsBlackTrack },
  { id: 67, name: "Modern Formal", category: "Formal Trouser", price: "\u20B93,199", image: pantsBlackTrack },
  { id: 68, name: "Pleated Formal", category: "Formal Trouser", price: "\u20B92,999", image: pantsBlackTrack },
  { id: 69, name: "Classic Formal", category: "Formal Trouser", price: "\u20B93,499", image: pantsBlackTrack },
  { id: 70, name: "Modern Formal", category: "Formal Trouser", price: "\u20B93,199", image: pantsBlackTrack },
  { id: 71, name: "Pleated Formal", category: "Formal Trouser", price: "\u20B92,999", image: pantsBlackTrack },
  { id: 72, name: "Classic Formal", category: "Formal Trouser", price: "\u20B93,499", image: pantsBlackTrack }
];
const ProductGrid = () => {
  const { category } = useParams();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;
  React.useEffect(() => {
    setCurrentPage(1);
  }, [category]);
  console.log("Current category param:", category);
  const filteredProducts = category ? products.filter((product) => {
    if (category === "shop" || category === "new-in") return true;
    return product.category.toLowerCase() === category.toLowerCase();
  }) : products;
  const totalItems = filteredProducts.length;
  let totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalItems > 0 && totalItems % itemsPerPage === 0) {
    totalPages += 1;
  }
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleFavorite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  return <section className="w-full px-6 mb-16">
      {currentProducts.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {currentProducts.map((product) => <Link key={product.id} to={`/product/${product.id}`}>
              <Card
    className="border-none shadow-none bg-transparent group cursor-pointer"
  >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-105"
  />
                    <div className="absolute inset-0 bg-black/[0.03]" />
                    {product.isNew && <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black bg-white/80 backdrop-blur-sm rounded-sm">
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
                    <p className="text-sm font-light text-muted-foreground">
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
            </Link>)}
        </div> : <div className="flex flex-col items-center justify-center py-20 text-center">
          {
    /* Show empty state if on a page with no items (e.g. the extra page) */
  }
          <p className="text-muted-foreground">No more products to show.</p>
        </div>}

      {totalPages > 1 && <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />}
    </section>;
};
var stdin_default = ProductGrid;
export {
  stdin_default as default
};
