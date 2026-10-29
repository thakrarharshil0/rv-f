import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Droplets, Wind, Maximize, Leaf } from "lucide-react";
import denimTexture from "@/assets/denim-texture.jpg";
const features = [
  {
    icon: Droplets,
    title: "COMFORT",
    description: "Premium cotton blends that feel like a second skin. All-day comfort guaranteed.",
    stat: "98%",
    statLabel: "Customer Satisfaction"
  },
  {
    icon: Wind,
    title: "BREATHABILITY",
    description: "Engineered fabrics that keep you cool and dry, no matter the weather.",
    stat: "40%",
    statLabel: "More Breathable"
  },
  {
    icon: Maximize,
    title: "FIT & STRETCH",
    description: "4-way stretch technology that moves with your body, not against it.",
    stat: "360\xB0",
    statLabel: "Stretch Freedom"
  },
  {
    icon: Leaf,
    title: "SUSTAINABILITY",
    description: "Eco-friendly materials and ethical production for a better tomorrow.",
    stat: "100%",
    statLabel: "Organic Cotton"
  }
];
const ScrollStorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <section ref={ref} className="py-20 lg:py-32 relative overflow-hidden">
      {
    /* Background */
  }
      <div className="absolute inset-0 z-0">
        <div
    className="absolute inset-0 bg-cover bg-center opacity-5"
    style={{ backgroundImage: `url(${denimTexture})` }}
  />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {
    /* Section Header */
  }
        <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6 }}
    className="text-center mb-16 lg:mb-24"
  >
          <span className="inline-block px-4 py-1 bg-denim/10 text-denim text-sm font-medium tracking-widest rounded-full mb-4">
            WHY Royal Virtus
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            ENGINEERED FOR LIFE
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every stitch is designed with purpose. Experience the difference of premium bottomwear.
          </p>
        </motion.div>

        {
    /* Features Grid */
  }
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {features.map((feature, index) => <motion.div
    key={feature.title}
    initial={{ opacity: 0, y: 50 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    className="group text-center lg:text-left"
  >
              {
    /* Icon */
  }
              <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    className="inline-flex items-center justify-center w-16 h-16 bg-denim/10 text-denim rounded-2xl mb-6 transition-colors group-hover:bg-denim group-hover:text-white"
  >
                <feature.icon size={28} />
              </motion.div>

              {
    /* Stat */
  }
              <div className="font-display text-5xl lg:text-6xl text-denim mb-2">
                {feature.stat}
              </div>
              <div className="text-xs tracking-widest text-muted-foreground uppercase mb-4">
                {feature.statLabel}
              </div>

              {
    /* Title */
  }
              <h3 className="font-display text-xl tracking-wide mb-3">
                {feature.title}
              </h3>

              {
    /* Description */
  }
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
var stdin_default = ScrollStorySection;
export {
  stdin_default as default
};

