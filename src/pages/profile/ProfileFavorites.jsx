import ProfileLayout from "./ProfileLayout";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ProfileFavorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <ProfileLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-display mb-2">My Wishlist</h1>
          <p className="text-muted-foreground font-light">Saved items you love ({favorites.length}).</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {favorites.map((product) => (
              <div key={product.id} className="group relative bg-white border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-secondary/30">
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>

                {/* Actions Overlay */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-display text-lg mb-1 truncate">{product.name}</h3>
                    <p className="text-muted-foreground text-sm font-light">₹{product.price.toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 rounded-none uppercase tracking-widest text-[10px] h-10"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromFavorites(product.id)}
                      className="rounded-none border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 h-10 w-10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-display mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground font-light mb-8 max-w-xs">
              Save items you're interested in and they'll show up here.
            </p>
            <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs px-8 h-12" asChild>
              <Link to="/">Explore Collection</Link>
            </Button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default ProfileFavorites;
