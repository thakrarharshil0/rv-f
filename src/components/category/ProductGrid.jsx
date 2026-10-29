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
import api, { getImageUrl } from "@/lib/api";
import { Loader2 } from "lucide-react";

const ProductGrid = () => {
  const { category } = useParams();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const itemsPerPage = 12;

  React.useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.products.list({ 
          category: category === "shop" || category === "all" ? undefined : category,
          page: currentPage,
          perPage: itemsPerPage
        });
        
        const mapped = (response.items || []).map(p => ({
          ...p,
          image: getImageUrl(p.image)
        }));
        setProducts(mapped);
        setTotalPages(response.last_page || 1);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category, currentPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [category]);
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
      <div className="flex flex-col items-center justify-center py-20 text-center w-full">
        <Loader2 className="w-10 h-10 animate-spin text-denim mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading amazing products...</p>
      </div>
    );
  }

  return <section className="w-full px-6 mb-16">
      {products.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => <Link key={product.id} to={`/product/${product.id}`}>
              <Card
    className="border-none shadow-none bg-transparent group cursor-pointer"
  >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative rounded-xl">
                    <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-105"
  />
                    <div className="absolute inset-0 bg-black/[0.03]" />
                    {product.isNew && <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-white bg-denim rounded-sm">
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
                      <h3 className="text-sm font-medium text-foreground group-hover:text-denim transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-foreground">
                        ₹{parseFloat(product.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>)}
        </div> : <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">No products found in this category.</p>
        </div>}

      {totalPages > 1 && <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />}
    </section>;
};
var stdin_default = ProductGrid;
export {
  stdin_default as default
};
