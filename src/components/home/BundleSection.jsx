import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Gift, Truck, Percent } from "lucide-react";
const bundles = [
  {
    title: "The Essentials Bundle",
    description: "2 Shorts + 1 Track",
    discount: "15% OFF",
    originalPrice: 5097,
    salePrice: 4332,
    icon: Gift
  },
  {
    title: "Denim Duo",
    description: "2 Premium Jeans",
    discount: "20% OFF",
    originalPrice: 4998,
    salePrice: 3998,
    icon: Percent
  },
  {
    title: "Complete Wardrobe",
    description: "1 Jean + 1 Track + 1 Short",
    discount: "FREE SHIPPING",
    originalPrice: 5797,
    salePrice: 4997,
    icon: Truck
  }
];
const BundleSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <section ref={ref} className="py-20 lg:py-32 bg-sand">
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
          <span className="inline-block px-4 py-1 bg-denim/10 text-denim text-sm font-medium tracking-widest rounded-full mb-4">
            SAVE MORE
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
            BUNDLE & SAVE
          </h2>
          <p className="text-charcoal/70 text-lg max-w-xl mx-auto">
            Mix and match your favorites for exclusive bundle pricing
          </p>
        </motion.div>

        {
    /* Bundles Grid */
  }
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {bundles.map((bundle, index) => <motion.div
    key={bundle.title}
    initial={{ opacity: 0, y: 50 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    className="group"
  >
              <Link
    to="/bundles"
    className="block bg-background rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow"
  >
                {
    /* Icon & Badge */
  }
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-denim/10 text-denim rounded-xl">
                    <bundle.icon size={28} />
                  </div>
                  <span className="px-3 py-1 bg-denim text-white text-sm font-medium rounded-full">
                    {bundle.discount}
                  </span>
                </div>

                {
    /* Content */
  }
                <h3 className="font-display text-2xl text-charcoal mb-2">
                  {bundle.title}
                </h3>
                <p className="text-muted-foreground mb-6">{bundle.description}</p>

                {
    /* Pricing */
  }
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl text-denim">
                    ₹{bundle.salePrice.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground line-through">
                    ₹{bundle.originalPrice.toLocaleString()}
                  </span>
                </div>

                {
    /* CTA */
  }
                <div className="mt-6 pt-6 border-t border-border">
                  <span className="text-sm font-medium text-foreground group-hover:text-denim transition-colors">
                    Shop This Bundle →
                  </span>
                </div>
              </Link>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
var stdin_default = BundleSection;
export {
  stdin_default as default
};
