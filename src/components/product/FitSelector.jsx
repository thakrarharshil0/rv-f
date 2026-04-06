import { motion, AnimatePresence } from "framer-motion";
import jeansSlim from "@/assets/jeans-slim.jpg";
import jeansRelaxed from "@/assets/jeans-relaxed.jpg";
import jeansTapered from "@/assets/jeans-tapered.jpg";
import jeansBaggy from "@/assets/jeans-baggy.jpg";
const fitData = {
  slim: {
    name: "Slim Fit",
    description: "Close to body, modern silhouette",
    image: jeansSlim
  },
  relaxed: {
    name: "Relaxed Fit",
    description: "Easy, comfortable through hip and thigh",
    image: jeansRelaxed
  },
  tapered: {
    name: "Tapered Fit",
    description: "Relaxed top, narrower at ankle",
    image: jeansTapered
  },
  baggy: {
    name: "Baggy Fit",
    description: "Loose throughout, streetwear vibe",
    image: jeansBaggy
  }
};
const genderOptions = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" }
];
const fitOptions = {
  men: [
    { value: "slim", label: "Slim Fit" },
    { value: "regular", label: "Regular Fit" },
    { value: "relaxed", label: "Relaxed Fit" },
    { value: "skinny", label: "Skinny Fit" },
    { value: "tapered", label: "Tapered Fit" }
  ],
  women: [
    { value: "skinny", label: "Skinny Fit" },
    { value: "slim", label: "Slim Fit" },
    { value: "straight", label: "Straight Fit" },
    { value: "boyfriend", label: "Boyfriend Fit" },
    { value: "wide-leg", label: "Wide Leg" }
  ]
};
const FitSelector = ({ selectedFit, onFitChange }) => {
  const fits = ["slim", "relaxed", "tapered", "baggy"];
  return <div className="space-y-6">
      {
    /* Fit Buttons */
  }
      <div className="flex flex-wrap gap-3">
        {fits.map((fit) => <button
    key={fit}
    onClick={() => onFitChange(fit)}
    className={`fit-btn ${selectedFit === fit ? "active" : ""}`}
  >
            {fitData[fit].name}
          </button>)}
      </div>

      {
    /* Fit Description */
  }
      <AnimatePresence mode="wait">
        <motion.div
    key={selectedFit}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
    className="flex items-center gap-2 text-sm"
  >
          <span className="font-medium">{fitData[selectedFit].name}:</span>
          <span className="text-muted-foreground">{fitData[selectedFit].description}</span>
        </motion.div>
      </AnimatePresence>
    </div>;
};
var stdin_default = FitSelector;
export {
  stdin_default as default,
  fitData,
  fitOptions,
  genderOptions
};
