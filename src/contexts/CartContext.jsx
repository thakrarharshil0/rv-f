import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(void 0);

const hasAuthToken = () => Boolean(localStorage.getItem("Royal Virtus-token"));

const parsePrice = (price) => {
  if (typeof price === "number") return price;
  return parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
};

const mapServerCartItems = (items) =>
  items.map((item) => ({
    id: item.id,
    productId: item.product_id, // Match backend field name
    name: item.name,
    image: item.image,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    price: item.price,
  }));

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadAndSyncCart = async () => {
      // 1. Load from local storage initially
      const savedCart = localStorage.getItem("Royal Virtus-cart");
      let localItems = [];
      if (savedCart) {
        try {
          localItems = JSON.parse(savedCart);
          setCartItems(localItems);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }

      if (!user) return;

      try {
        // 2. Fetch server cart
        const serverData = await api.cart.get();
        const serverItems = mapServerCartItems(serverData.items || []);

        // 3. If local cart has items and server cart is empty (or we want to merge), sync them
        // For simplicity, if server cart is empty but local has items, we push local to server
        if (serverItems.length === 0 && localItems.length > 0) {
          for (const item of localItems) {
            await api.cart.addItem({
              productId: item.productId || item.id,
              name: item.name,
              image: item.image,
              price: item.price,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
            });
          }
          // Fetch again after sync
          const updatedData = await api.cart.get();
          setCartItems(mapServerCartItems(updatedData.items || []));
        } else {
          // Use server cart as source of truth when logged in
          setCartItems(serverItems);
        }
      } catch (error) {
        console.error("Failed to sync cart:", error.message);
      }
    };

    loadAndSyncCart();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("Royal Virtus-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => String(i.productId || i.id) === String(item.id) && i.size === item.size
      );

      if (existingItem) {
        return prevItems.map(
          (i) =>
            String(i.productId || i.id) === String(item.id) && i.size === item.size
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
        );
      } else {
        return [...prevItems, { ...item, productId: item.id, quantity: item.quantity || 1 }];
      }
    });

    if (hasAuthToken()) {
      try {
        const data = await api.cart.addItem({
          productId: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity || 1,
        });
        setCartItems(mapServerCartItems(data.items || []));
      } catch (error) {
        console.error("Failed to add cart item on server:", error.message);
      }
    }

    toast({
      title: "Added to Bag",
      description: `${item.name} has been added to your cart.`
    });
  };

  const removeFromCart = async (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

    if (hasAuthToken()) {
      try {
        const data = await api.cart.removeItem(id);
        setCartItems(mapServerCartItems(data.items || []));
      } catch (error) {
        console.error("Failed to remove cart item on server:", error.message);
      }
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      (prevItems) => prevItems.map(
        (item) => item.id === id ? { ...item, quantity } : item
      )
    );

    if (hasAuthToken()) {
      try {
        const data = await api.cart.updateItem(id, { quantity });
        setCartItems(mapServerCartItems(data.items || []));
      } catch (error) {
        console.error("Failed to update cart item on server:", error.message);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const priceValue = parsePrice(item.price);
    return total + priceValue * item.quantity;
  }, 0);

  return <CartContext.Provider
    value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalItems,
      cartTotal,
      clearCart
    }}
  >
            {children}
        </CartContext.Provider>;
};
export {
  CartProvider,
  useCart
};

