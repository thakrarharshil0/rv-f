import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Minus, Plus, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const productId = 1;
  const product = {
    id: productId,
    name: "Classic Skinny",
    category: "Jeans",
    price: "\u20B92,499",
    image: "/src/assets/jeans-black-skinny.jpg"
  };
  const toggleFavorite = () => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(product);
    }
  };
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  return <div className="space-y-6">
      {
    /* Breadcrumb - Show only on desktop */
  }
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/category/jeans">Jeans</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Classic Skinny</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {
    /* Product title and price */
  }
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">Jeans</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">Classic Skinny</h1>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <p className="text-xl font-light text-foreground">₹2,499</p>
            <button
    onClick={toggleFavorite}
    className="p-2 hover:bg-muted/10 rounded-full transition-colors"
    aria-label={isFavorite(productId) ? "Remove from favorites" : "Add to favorites"}
  >
              <Heart
    size={22}
    className={isFavorite(productId) ? "fill-red-500 text-red-500" : "text-foreground"}
  />
            </button>
          </div>
        </div>

        {
    /* Product details */
  }
        <div className="space-y-4 py-4 border-b border-border">
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Fit</h3>
            <p className="text-sm font-light text-muted-foreground">Slim Fit</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Material</h3>
            <p className="text-sm font-light text-muted-foreground">98% Cotton, 2% Elastane</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Care</h3>
            <p className="text-sm font-light text-muted-foreground">Machine wash cold</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Editor's notes</h3>
            <p className="text-sm font-light text-muted-foreground italic">"Essential black jeans that provide the perfect foundation for any outfit. Versatile, comfortable, and timeless."</p>
          </div>
        </div>

        {
    /* Quantity and Add to Cart */
  }
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-light text-foreground">Quantity</span>
            <div className="flex items-center border border-border">
              <Button
    variant="ghost"
    size="sm"
    onClick={decrementQuantity}
    className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
  >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
                {quantity}
              </span>
              <Button
    variant="ghost"
    size="sm"
    onClick={incrementQuantity}
    className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
  >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
    onClick={() => addToCart({
      id: "featured-skinny-1",
      // Using a fixed ID for this demo component
      name: "Classic Skinny",
      price: 2499,
      image: "/src/assets/jeans-black-skinny.jpg",
      // Ideally this should be imported or passed via props
      category: "Jeans",
      quantity,
      size: "32"
      // Default size
    })}
    className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
  >
            Add to Bag
          </Button>
        </div>
      </div>
    </div>;
};
var stdin_default = ProductInfo;
export {
  stdin_default as default
};
