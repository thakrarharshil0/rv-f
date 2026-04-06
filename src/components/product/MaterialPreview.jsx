import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Droplets, Wind, Maximize } from "lucide-react";
import denimTexture from "@/assets/denim-texture.jpg";
const materials = {
  "stretchable-cotton-denim": {
    name: "Stretchable Cotton Denim",
    composition: "98% Cotton, 2% Elastane",
    features: [
      { icon: Droplets, label: "Soft Touch" },
      { icon: Maximize, label: "4-Way Stretch" },
      { icon: Wind, label: "Breathable" }
    ],
    texture: denimTexture
  },
  "premium-twill": {
    name: "Premium Twill",
    composition: "100% Organic Cotton",
    features: [
      { icon: Droplets, label: "Durable" },
      { icon: Wind, label: "Lightweight" }
    ],
    texture: denimTexture
  }
};
const MaterialPreview = ({ materialId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const material = materials[materialId] || materials["stretchable-cotton-denim"];
  return <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Info size={16} />
        <span>Hover to explore material</span>
      </div>

      <motion.div
    className="relative rounded-xl overflow-hidden cursor-pointer"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
        {
    /* Texture Image */
  }
        <motion.div
    className="aspect-video relative"
    animate={{
      filter: isHovered ? "blur(0px)" : "blur(8px)"
    }}
    transition={{ duration: 0.4 }}
  >
          <img
    src={material.texture}
    alt={material.name}
    className="w-full h-full object-cover"
  />
        </motion.div>

        {
    /* Overlay Content */
  }
        <AnimatePresence>
          {isHovered && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
  >
              <motion.h4
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.1 }}
    className="text-white font-display text-2xl mb-1"
  >
                {material.name}
              </motion.h4>
              <motion.p
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.15 }}
    className="text-white/70 text-sm mb-4"
  >
                {material.composition}
              </motion.p>
              <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 }}
    className="flex gap-3"
  >
                {material.features.map((feature, index) => <span
    key={index}
    className="flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-xs rounded-full"
  >
                    <feature.icon size={12} />
                    {feature.label}
                  </span>)}
              </motion.div>
            </motion.div>}
        </AnimatePresence>

        {
    /* Pre-hover state */
  }
        <AnimatePresence>
          {!isHovered && <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center"
  >
              <span className="px-4 py-2 bg-white/90 text-foreground text-sm font-medium rounded-lg shadow-lg">
                🧵 {material.name}
              </span>
            </motion.div>}
        </AnimatePresence>
      </motion.div>
    </div>;
};
var stdin_default = MaterialPreview;
export {
  stdin_default as default
};
