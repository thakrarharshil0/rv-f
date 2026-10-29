import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await login({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isLogin,
      });
      // Redirect to Admin Dashboard instead of storefront home
      navigate("/admin");
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain dark:brightness-0 dark:invert" />
              </div>
              <h1 className="font-display text-3xl mb-2">
                {isLogin ? "Admin Login" : "Create Admin Account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin ? "Enter administrative credentials to access the dashboard" : "Register a new administrative account"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 mb-4">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="John Admin"
                          className="pl-10 h-11"
                          required={!isLogin}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10 h-11"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  {isLogin && (
                    <button type="button" className="text-xs text-denim hover:underline">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

              <Button type="submit" className="w-full h-12 rounded-none mt-6" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Initialize Control" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Need a new admin account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage("");
                }}
                className="font-medium hover:underline text-foreground"
              >
                {isLogin ? "Contact Super Admin" : "Log in"}
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
