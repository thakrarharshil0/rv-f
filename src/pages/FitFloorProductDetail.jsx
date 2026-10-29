import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import Royal VirtusHeader from "../components/layout/Royal VirtusHeader";
import Royal VirtusFooter from "../components/layout/Royal VirtusFooter";
import FitSelector, { fitData } from "../components/product/FitSelector";
import MaterialPreview from "../components/product/MaterialPreview";
import ProductRotateView from "../components/product/ProductRotateView";
import { ShoppingBag, Heart, Truck, RotateCcw, Shield, Minus, Plus, ChevronDown } from "lucide-react";
const productData = {
  id: "essential-slim-fit",
  name: "Essential Slim Fit Jeans",
  category: "Jeans",
  price: 2499,
  originalPrice: 2999,
  material: "stretchable-cotton-denim",
  sizes: ["28", "30", "32", "34", "36", "38"],
  colors: [
    { name: "Indigo Blue", hex: "#3d5a80" },
    { name: "Black", hex: "#1a1a1a" },
    { name: "Light Wash", hex: "#8aa9c4" }
  ],
  description: "Our signature slim fit jeans, crafted from premium stretchable cotton denim. Designed for all-day comfort with a modern silhouette that flatters every body type.",
  features: [
    "4-way stretch technology",
    "Reinforced stitching",
    "Hidden phone pocket",
    "Sustainable production"
  ],
  pairing: {
    title: "Style It With",
    items: [
      { type: "Hoodie", name: "Essential Grey Hoodie", price: 1299 },
      { type: "Tee", name: "Oversized White Tee", price: 799 },
      { type: "Sneakers", name: "White Canvas Sneakers", price: 1999 }
    ]
  }
};
const Royal VirtusProductDetail = () => {
  const { productId } = useParams();
  const [selectedFit, setSelectedFit] = useState("slim");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("description");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const productImages = [
    fitData[selectedFit].image,
    fitData[selectedFit].image,
    fitData[selectedFit].image,
    fitData[selectedFit].image
  ];
  return <div className="min-h-screen bg-background">
      <Royal VirtusHeader />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {
    /* Breadcrumb */
  }
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/category/jeans" className="hover:text-foreground transition-colors">
              Jeans
            </Link>
            <span>/</span>
            <span className="text-foreground">{productData.name}</span>
          </nav>

          <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {
    /* Product Images */
  }
            <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.6 }}
  >
              <ProductRotateView images={productImages} productName={productData.name} />
            </motion.div>

            {
    /* Product Info */
  }
            <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={isInView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="space-y-6"
  >
              {
    /* Category & Title */
  }
              <div>
                <span className="text-sm text-denim font-medium tracking-widest uppercase">
                  {productData.category}
                </span>
                <h1 className="font-display text-4xl lg:text-5xl mt-2 mb-4">
                  {productData.name}
                </h1>

                {
    /* Price */
  }
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl">
                    ₹{productData.price.toLocaleString()}
                  </span>
                  {productData.originalPrice && <>
                      <span className="text-muted-foreground line-through text-lg">
                        ₹{productData.originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-destructive/10 text-destructive text-sm font-medium rounded">
                        {Math.round(
    (productData.originalPrice - productData.price) / productData.originalPrice * 100
  )}
                        % OFF
                      </span>
                    </>}
                </div>
              </div>

              {
    /* Fit Selector */
  }
              <div>
                <h3 className="font-medium mb-3">SELECT FIT</h3>
                <FitSelector selectedFit={selectedFit} onFitChange={setSelectedFit} />
              </div>

              {
    /* Color Selector */
  }
              <div>
                <h3 className="font-medium mb-3">
                  COLOR: <span className="text-muted-foreground">{selectedColor.name}</span>
                </h3>
                <div className="flex gap-3">
                  {productData.colors.map((color) => <button
    key={color.name}
    onClick={() => setSelectedColor(color)}
    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor.name === color.name ? "border-foreground scale-110" : "border-transparent"}`}
    style={{ backgroundColor: color.hex }}
    title={color.name}
  />)}
                </div>
              </div>

              {
    /* Size Selector */
  }
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">SELECT SIZE</h3>
                  <Link to="/size-guide" className="text-sm text-denim hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productData.sizes.map((size) => <button
    key={size}
    onClick={() => setSelectedSize(size)}
    className={`w-14 h-12 border-2 font-medium transition-all ${selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}
  >
                      {size}
                    </button>)}
                </div>
                {!selectedSize && <p className="text-sm text-muted-foreground mt-2">
                    Please select a size
                  </p>}
              </div>

              {
    /* Quantity & Add to Cart */
  }
              <div className="flex gap-4">
                {
    /* Quantity */
  }
                <div className="flex items-center border-2 border-border">
                  <button
    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
    className="p-3 hover:bg-secondary transition-colors"
  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
    onClick={() => setQuantity((q) => q + 1)}
    className="p-3 hover:bg-secondary transition-colors"
  >
                    <Plus size={16} />
                  </button>
                </div>

                {
    /* Add to Cart */
  }
                <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex-1 btn-primary flex items-center justify-center gap-2"
    disabled={!selectedSize}
  >
                  <ShoppingBag size={20} />
                  ADD TO BAG
                </motion.button>

                {
    /* Wishlist */
  }
                <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setIsWishlisted(!isWishlisted)}
    className={`p-4 border-2 transition-colors ${isWishlisted ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:border-primary"}`}
  >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {
    /* Trust Badges */
  }
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={20} className="text-denim" />
                  <span className="text-xs text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw size={20} className="text-denim" />
                  <span className="text-xs text-muted-foreground">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield size={20} className="text-denim" />
                  <span className="text-xs text-muted-foreground">Quality Guarantee</span>
                </div>
              </div>

              {
    /* Material Preview */
  }
              <MaterialPreview materialId={productData.material} />

              {
    /* Accordions */
  }
              <div className="space-y-2">
                {[
    { id: "description", title: "Description", content: productData.description },
    {
      id: "features",
      title: "Features",
      content: <ul className="list-disc list-inside space-y-1">
                        {productData.features.map((feature) => <li key={feature}>{feature}</li>)}
                      </ul>
    },
    {
      id: "care",
      title: "Care Instructions",
      content: "Machine wash cold. Tumble dry low. Do not bleach. Iron on low heat if needed."
    }
  ].map((item) => <div key={item.id} className="border-b border-border">
                    <button
    onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
    className="flex items-center justify-between w-full py-4 text-left font-medium"
  >
                      {item.title}
                      <ChevronDown
    size={20}
    className={`transition-transform ${activeAccordion === item.id ? "rotate-180" : ""}`}
  />
                    </button>
                    <AnimatePresence>
                      {activeAccordion === item.id && <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden"
  >
                          <div className="pb-4 text-muted-foreground">{item.content}</div>
                        </motion.div>}
                    </AnimatePresence>
                  </div>)}
              </div>

              {
    /* Outfit Pairing Suggestion */
  }
              <div className="bg-sand rounded-xl p-6">
                <h3 className="font-display text-xl mb-4">{productData.pairing.title}</h3>
                <div className="space-y-3">
                  {productData.pairing.items.map((item) => <div
    key={item.name}
    className="flex items-center justify-between py-2 border-b border-sand-dark last:border-0"
  >
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {item.type}
                        </span>
                        <p className="font-medium">{item.name}</p>
                      </div>
                      <span className="font-display text-lg">₹{item.price.toLocaleString()}</span>
                    </div>)}
                </div>
                <button className="w-full mt-4 py-3 border-2 border-charcoal text-charcoal font-medium rounded-lg hover:bg-charcoal hover:text-white transition-colors">
                  Add Complete Outfit
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Royal VirtusFooter />
    </div>;
};
var stdin_default = Royal VirtusProductDetail;
export {
  stdin_default as default
};

