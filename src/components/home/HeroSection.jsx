import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import heroModel from "@/assets/hero-model.jpg";
import denimTexture from "@/assets/denim-texture.jpg";
const HeroSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  const slideFromLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };
  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  const scaleIn = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };
  return <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {
    /* Parallax Background Texture */
  }
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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen pt-32 pb-16">
          {
    /* Text Content */
  }
          <motion.div
    variants={containerVariants}
    initial="hidden"
    animate={controls}
    className="text-center lg:text-left order-2 lg:order-1"
  >
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-block px-4 py-1 bg-denim/10 text-denim text-sm font-medium tracking-widest rounded-full">
                NEW COLLECTION 2024
              </span>
            </motion.div>

            <motion.h1
    variants={slideFromLeft}
    className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none mb-6"
  >
              THE
              <br />
              <span className="text-denim">PERFECT</span>
              <br />
              FIT
            </motion.h1>

            <motion.p
    variants={fadeUp}
    className="text-lg lg:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 mb-8"
  >
              Experience bottomwear that moves with you. Crafted for comfort, designed for style.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/category/jeans" className="btn-primary">
                SHOP JEANS
              </Link>
              <Link to="/fit-quiz" className="btn-outline">
                FIND YOUR FIT
              </Link>
            </motion.div>

            {
    /* Feature Pills */
  }
            <motion.div
    variants={fadeUp}
    className="flex flex-wrap gap-3 mt-10 justify-center lg:justify-start"
  >
              {["Free Shipping", "30-Day Returns", "Perfect Fit Guarantee"].map((feature) => <span
    key={feature}
    className="px-4 py-2 bg-secondary text-secondary-foreground text-sm rounded-full"
  >
                  {feature}
                </span>)}
            </motion.div>
          </motion.div>

          {
    /* Hero Image */
  }
          <motion.div
    variants={scaleIn}
    initial="hidden"
    animate={controls}
    className="relative order-1 lg:order-2"
  >
            <div className="relative">
              {
    /* Main Image */
  }
              <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="relative z-10"
  >
                <img
    src={heroModel}
    alt="Model wearing FITFLOOR jeans"
    className="w-full h-auto max-h-[80vh] object-cover object-center rounded-2xl"
  />
                {
    /* Gradient overlay at bottom */
  }
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent rounded-b-2xl" />
              </motion.div>

              {
    /* Floating Badge */
  }
              <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
    className="absolute bottom-8 left-4 lg:-left-8 z-20 bg-denim text-white px-6 py-4 rounded-xl shadow-2xl"
  >
                <p className="text-sm font-medium">Starting from</p>
                <p className="font-display text-3xl">₹1,499</p>
              </motion.div>

              {
    /* Background Shape */
  }
              <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.3, duration: 0.8 }}
    className="absolute -top-8 -right-8 w-64 h-64 bg-sand rounded-full -z-10 animate-morph"
  />
            </div>
          </motion.div>
        </div>
      </div>

      {
    /* Scroll Indicator */
  }
      <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2 }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground"
  >
        <span className="text-xs tracking-widest mb-2">SCROLL</span>
        <ChevronDown className="scroll-indicator" size={20} />
      </motion.div>
    </section>;
};
var stdin_default = HeroSection;
export {
  stdin_default as default
};
