import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import heroModelDefault from "@/assets/hero-model.jpg";
import denimTexture from "@/assets/denim-texture.jpg";

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [storeFeatures, setStoreFeatures] = useState(["Free Shipping", "30-Day Returns", "Perfect Fit Guarantee"]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const fetchHeroBanners = async () => {
    try {
      const [bannerRes, settingsRes] = await Promise.all([
        api.banners.getActive(),
        api.settings.getPublic()
      ]);

      const activeHeroes = bannerRes.items?.filter(b => b.placement === 'Homepage Hero' && b.status === 'Active') || [];
      setBanners(activeHeroes);

      if (settingsRes.store_features) {
        setStoreFeatures(settingsRes.store_features);
      }
    } catch (error) {
      console.error("Failed to load hero content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls, currentIndex]); // Restart animations when index changes

  const heroBanner = banners[currentIndex] || null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const slideFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${denimTexture})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50" />
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroBanner ? heroBanner.id : 'default'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen pt-32 pb-16"
          >
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div variants={fadeUp} className="mb-4">
                <span className="inline-block px-4 py-1 bg-denim/10 text-denim text-sm font-medium tracking-widest rounded-full uppercase">
                  {heroBanner ? heroBanner.format : "NEW COLLECTION 2024"}
                </span>
              </motion.div>

              <motion.h1
                variants={slideFromLeft}
                className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-none mb-6 uppercase"
              >
                {heroBanner ? (
                  <>
                    {heroBanner.title.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word === 'PERFECT' ? <span className="text-denim">{word}</span> : word}
                        {i % 2 === 1 ? <br /> : ' '}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <>
                    THE
                    <br />
                    <span className="text-denim">PERFECT</span>
                    <br />
                    FIT
                  </>
                )}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg lg:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 mb-8"
              >
                {heroBanner ? `Curated for ${heroBanner.audience.toLowerCase()}. ${heroBanner.format} designed for premium style.` : "Experience bottomwear that moves with you. Crafted for comfort, designed for style."}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/category/jeans" className="btn-primary flex items-center justify-center gap-2">
                  {heroBanner ? heroBanner.ctaText : "SHOP JEANS"}
                  {heroBanner && <ArrowRight size={18} />}
                </Link>
                {!heroBanner && (
                  <Link to="/fit-quiz" className="btn-outline">
                    FIND YOUR FIT
                  </Link>
                )}
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-3 mt-10 justify-center lg:justify-start"
              >
                {storeFeatures.map((feature) => (
                  <span key={feature} className="px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-full">
                    {feature}
                  </span>
                ))}
              </motion.div>

              {banners.length > 1 && (
                <div className="flex gap-2 mt-8 justify-center lg:justify-start">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-denim' : 'w-2 bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <motion.div
              variants={fadeUp}
              className="relative order-1 lg:order-2"
            >
              <div className="relative">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative z-10"
                >
                  <img
                    src={heroBanner ? heroBanner.cover : heroModelDefault}
                    alt={heroBanner ? heroBanner.title : "Model wearing Royal Virtus jeans"}
                    className="w-full h-auto max-h-[80vh] object-cover object-center rounded-2xl shadow-2xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent rounded-b-2xl" />
                </motion.div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                  className="absolute bottom-8 left-4 lg:-left-8 z-20 bg-denim text-white px-6 py-4 rounded-xl shadow-2xl"
                >
                  <p className="text-sm font-medium">Starting from</p>
                  <p className="font-display text-3xl">₹1,499</p>
                </motion.div>

                <div className="absolute -top-8 -right-8 w-64 h-64 bg-sand rounded-full -z-10 animate-morph opacity-50" />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground"
        >
          <span className="text-xs tracking-widest mb-2">SCROLL</span>
          <ChevronDown className="scroll-indicator" size={20} />
        </motion.div>
      </div>
    </section>;
};
var stdin_default = HeroSection;
export {
  stdin_default as default
};

