import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
const FitQuizCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <section ref={ref} className="py-20 lg:py-32 bg-charcoal text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative">
          {
    /* Background Elements */
  }
          <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={isInView ? { scale: 1, opacity: 0.1 } : {}}
    transition={{ duration: 1 }}
    className="absolute -top-32 -right-32 w-96 h-96 bg-denim rounded-full blur-3xl"
  />
          <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={isInView ? { scale: 1, opacity: 0.1 } : {}}
    transition={{ duration: 1, delay: 0.2 }}
    className="absolute -bottom-32 -left-32 w-64 h-64 bg-sand rounded-full blur-3xl"
  />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            {
    /* Icon */
  }
            <motion.div
    initial={{ scale: 0 }}
    animate={isInView ? { scale: 1 } : {}}
    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
    className="inline-flex items-center justify-center w-20 h-20 bg-denim rounded-full mb-8"
  >
              <Sparkles size={36} />
            </motion.div>

            {
    /* Content */
  }
            <motion.h2
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="font-display text-4xl md:text-5xl lg:text-6xl mb-6"
  >
              NOT SURE ABOUT
              <br />
              YOUR SIZE?
            </motion.h2>

            <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="text-white/70 text-lg mb-8 max-w-xl mx-auto"
  >
              Take our 2-minute fit quiz and get personalized size recommendations.
              Say goodbye to returns and hello to perfect fits.
            </motion.p>

            <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: 0.5 }}
    className="flex flex-col sm:flex-row gap-4 justify-center"
  >
              <Link
    to="/fit-quiz"
    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-charcoal font-medium rounded-lg hover:bg-white/90 transition-colors group"
  >
                Take the Fit Quiz
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
    to="/about/size-guide"
    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
  >
                View Size Guide
              </Link>
            </motion.div>

            {
    /* Stats */
  }
            <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: 0.6 }}
    className="flex justify-center gap-12 mt-12 pt-12 border-t border-white/10"
  >
              <div className="text-center">
                <div className="font-display text-4xl text-denim">95%</div>
                <div className="text-white/60 text-sm mt-1">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-denim">50K+</div>
                <div className="text-white/60 text-sm mt-1">Quizzes Taken</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl text-denim">2 min</div>
                <div className="text-white/60 text-sm mt-1">Average Time</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
};
var stdin_default = FitQuizCTA;
export {
  stdin_default as default
};
