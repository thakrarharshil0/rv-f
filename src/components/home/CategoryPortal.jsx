import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import jeansSlim from "@/assets/jeans-slim.jpg";
import tracksBlack from "@/assets/tracks-black.jpg";
import shortsBeige from "@/assets/shorts-beige.jpg";
const categories = [
  {
    name: "Jeans",
    description: "Classic denim redefined",
    image: jeansSlim,
    path: "/category/jeans",
    color: "bg-denim"
  },
  {
    name: "Tracks",
    description: "Comfort meets street",
    image: tracksBlack,
    path: "/category/tracks",
    color: "bg-charcoal"
  },
  {
    name: "Shorts",
    description: "Summer essentials",
    image: shortsBeige,
    path: "/category/shorts",
    color: "bg-sand-dark"
  }
];
const CategoryPortal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <section ref={ref} className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {
    /* Section Header */
  }
        <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6 }}
    className="text-center mb-12 lg:mb-16"
  >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            SHOP BY CATEGORY
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find your perfect fit across our curated collections
          </p>
        </motion.div>

        {
    /* Category Grid */
  }
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => <motion.div
    key={category.name}
    initial={{ opacity: 0, y: 50 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: index * 0.2 }}
  >
              <Link
    to={category.path}
    className="group block relative overflow-hidden rounded-2xl aspect-[3/4] img-zoom"
  >
                {
    /* Image */
  }
                <img
    src={category.image}
    alt={category.name}
    className="absolute inset-0 w-full h-full object-cover"
  />

                {
    /* Gradient Overlay */
  }
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {
    /* Content */
  }
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  <div className={`w-12 h-1 ${category.color} mb-4 transition-all duration-300 group-hover:w-20`} />
                  <h3 className="font-display text-4xl lg:text-5xl text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/70 mb-4">{category.description}</p>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <span>Shop Now</span>
                    <ArrowRight
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-2"
  />
                  </div>
                </div>

                {
    /* Hover Border Effect */
  }
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/20 rounded-2xl transition-colors duration-300" />
              </Link>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
var stdin_default = CategoryPortal;
export {
  stdin_default as default
};
