import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Category from "./pages/Category";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import OurStory from "./pages/about/OurStory";
import Sustainability from "./pages/about/Sustainability";
import SizeGuide from "./pages/about/SizeGuide";
import CustomerCare from "./pages/about/CustomerCare";
import StoreLocator from "./pages/about/StoreLocator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FitQuiz from "./pages/FitQuiz";
import Login from "./pages/Login";
import AdminApp from "./admin/AdminApp";
import AdminLogin from "./pages/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileIndex from "./pages/profile/ProfileIndex";
import ProfileOrders from "./pages/profile/ProfileOrders";
import ProfileOrderDetail from "./pages/profile/ProfileOrderDetail";
import ProfileFavorites from "./pages/profile/ProfileFavorites";
import ProfileSettings from "./pages/profile/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/product/:productId" element={<ProductDetail />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/about/our-story" element={<OurStory />} />
                <Route path="/about/sustainability" element={<Sustainability />} />
                <Route path="/about/size-guide" element={<SizeGuide />} />
                <Route path="/about/customer-care" element={<CustomerCare />} />
                <Route path="/about/store-locator" element={<StoreLocator />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/fit-quiz" element={<FitQuiz />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                
                {/* User Profile Routes */}
                <Route path="/profile" element={<ProfileIndex />} />
                <Route path="/profile/orders" element={<ProfileOrders />} />
                <Route path="/profile/orders/:orderId" element={<ProfileOrderDetail />} />
                <Route path="/profile/favorites" element={<ProfileFavorites />} />
                <Route path="/profile/settings" element={<ProfileSettings />} />
                
                {/* Admin Routes (Protected) */}
                <Route 
                  path="/admin/*" 
                  element={
                    <AdminProtectedRoute>
                      <AdminApp />
                    </AdminProtectedRoute>
                  } 
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
