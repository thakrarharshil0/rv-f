import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { login, socialLogin, user } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    /* global google */
    const initializeGoogle = () => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id: "743766160104-17nvnllkntirlf4t5huh1c6q6l2crh2v.apps.googleusercontent.com",
          callback: handleGoogleCallback,
        });
      }
    };

    // Check if script is loaded, otherwise wait
    if (window.google) {
      initializeGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogle();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      await socialLogin({
        token: response.credential,
        provider: "google"
      });
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google Login Error:", error);
      setErrorMessage("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap is not displayed, fallback to a standard button or custom click handler
          // For now, we'll try to trigger the selector
          window.google.accounts.id.renderButton(
             document.getElementById("googleBtnHidden"),
             { theme: "outline", size: "large" }
          );
          document.getElementById("googleBtnHidden")?.querySelector('div[role="button"]')?.click();
        }
      });
    } else {
      setErrorMessage("Google Sign-In is still loading. Please wait a moment.");
    }
  };

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
      navigate(from, { replace: true });
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
              <h1 className="font-display text-3xl mb-2">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin ? "Enter your details to access your account" : "Join us for exclusive offers and faster checkout"}
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
                          placeholder="John Doe"
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
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
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <div id="googleBtnHidden" className="hidden"></div>
              <Button 
                variant="outline" 
                className="h-11 rounded-none font-normal"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                Google
              </Button>
              <Button variant="outline" className="h-11 rounded-none font-normal">
                Apple
              </Button>
            </div>

            {/* Toggle */}
            <div className="mt-8 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage("");
                }}
                className="font-medium hover:underline text-foreground"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
