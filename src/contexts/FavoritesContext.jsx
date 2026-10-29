import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";
const FavoritesContext = createContext(void 0);

const hasAuthToken = () => Boolean(localStorage.getItem("royal-virtus-token"));

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const savedFavorites = localStorage.getItem("favorites");
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error("Error parsing favorites from local storage:", error);
        }
      }

      if (!hasAuthToken()) {
        return;
      }

      try {
        const data = await api.favorites.get();
        setFavorites(data.items || []);
      } catch (error) {
        console.error("Failed to load favorites from server:", error.message);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = async (product) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });

    if (hasAuthToken()) {
      try {
        const data = await api.favorites.add(product);
        setFavorites(data.items || []);
      } catch (error) {
        console.error("Failed to add favorite on server:", error.message);
      }
    }
  };

  const removeFromFavorites = async (productId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));

    if (hasAuthToken()) {
      try {
        const data = await api.favorites.remove(productId);
        setFavorites(data.items || []);
      } catch (error) {
        console.error("Failed to remove favorite on server:", error.message);
      }
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((p) => p.id === productId);
  };

  return <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>;
};
const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === void 0) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
export {
  FavoritesProvider,
  useFavorites
};

