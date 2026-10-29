import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gift, Truck, Percent, Package, Loader2 } from "lucide-react";
import api from "@/lib/api";

const iconMap = {
  Gift: Gift,
  Truck: Truck,
  Percent: Percent,
  Package: Package
};

const BundleSection = () => {
  const [bundles, setBundles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const data = await api.bundles.list();
        setBundles(data || []);
      } catch (error) {
        console.error("Failed to fetch bundles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBundles();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-sand flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#C41230]" />
      </section>
    );
  }

  if (bundles.length === 0) return null;

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-sand">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1 bg-[#C41230]/10 text-[#C41230] text-sm font-bold tracking-widest uppercase mb-4">
            SAVE MORE
          </span>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-black mb-4 uppercase tracking-tighter">
            BUNDLE & SAVE
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto italic font-light">
            Mix and match your favorites for exclusive bundle pricing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {bundles.map((bundle, index) => {
            const IconComponent = iconMap[bundle.icon] || Package;
            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group"
              >
                <Link
                  to="/category/all"
                  className="block bg-white border-2 border-transparent hover:border-black p-8 lg:p-10 transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#C41230] text-white flex items-center justify-center translate-x-8 -translate-y-8 rotate-45 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform">
                    <span className="text-[10px] font-bold -rotate-45 mb-4">HOT</span>
                  </div>

                  <div className="flex items-start justify-between mb-8">
                    <div className="p-4 bg-gray-50 rounded-none group-hover:bg-[#C41230] group-hover:text-white transition-colors">
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>
                    <span className="px-4 py-1 bg-[#C41230] text-white text-xs font-bold uppercase tracking-widest">
                      {bundle.discount_text}
                    </span>
                  </div>

                  <h3 className="font-bold text-2xl text-black mb-3 uppercase tracking-tight">
                    {bundle.title}
                  </h3>
                  <p className="text-gray-500 mb-8 italic font-light text-sm">{bundle.description}</p>

                  <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-3xl font-bold text-black">
                      ₹{parseFloat(bundle.sale_price).toLocaleString()}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      ₹{parseFloat(bundle.original_price).toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-[#C41230] transition-colors">
                      Shop This Bundle
                    </span>
                    <div className="w-8 h-px bg-black group-hover:w-12 group-hover:bg-[#C41230] transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
