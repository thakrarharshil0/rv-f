import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Ruler, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
const questions = [
  {
    id: 1,
    question: "What is your primary fit preference?",
    options: [
      { id: "slim", label: "Slim / Tight", description: "Hugs the body, form-fitting" },
      { id: "regular", label: "Regular / Straight", description: "Classic fit, neither too tight nor loose" },
      { id: "relaxed", label: "Relaxed / Loose", description: "Roomy and comfortable" }
    ]
  },
  {
    id: 2,
    question: "How tall are you?",
    options: [
      { id: "short", label: `Under 5'7"`, description: "Petite / Short" },
      { id: "avg", label: `5'7" - 6'0"`, description: "Average height" },
      { id: "tall", label: `Over 6'0"`, description: "Tall / Long" }
    ]
  },
  {
    id: 3,
    question: "Which brand sizing fits you best currently?",
    options: [
      { id: "zara", label: "Zara / H&M", description: "Standard Euro sizing" },
      { id: "levis", label: "Levi's / Gap", description: "Standard US sizing" },
      { id: "nike", label: "Nike / Adidas", description: "Athletic sizing" },
      { id: "none", label: "Not sure / Varies", description: "It's complicated" }
    ]
  }
];
const FitQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOptionSelect = (optionId) => {
    setAnswers({ ...answers, [questions[currentStep].id]: optionId });
  };
  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishQuiz();
    }
  };
  const finishQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsComplete(true);
    }, 1500);
  };
  const getRecommendation = () => {
    const fit = answers[1];
    if (fit === "slim") return "Slim Fit";
    if (fit === "regular") return "Regular Fit";
    return "Relaxed Fit";
  };
  return <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 max-w-2xl mx-auto w-full">
                {!isComplete ? <div className="w-full">
                        {
    /* Progress Bar */
  }
                        <div className="w-full bg-secondary h-2 rounded-full mb-8">
                            <motion.div
    className="bg-primary h-full rounded-full"
    initial={{ width: 0 }}
    animate={{ width: `${(currentStep + 1) / questions.length * 100}%` }}
    transition={{ duration: 0.3 }}
  />
                        </div>

                        <AnimatePresence mode="wait">
                            {loading ? <motion.div
    key="loading"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-12"
  >
                                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-spin-slow" />
                                    <h2 className="text-2xl font-light">Analyzing your profile...</h2>
                                    <p className="text-muted-foreground mt-2">Finding your perfect fit</p>
                                </motion.div> : <motion.div
    key={currentStep}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
                                    <div className="mb-8 text-center">
                                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                            Question {currentStep + 1} of {questions.length}
                                        </span>
                                        <h2 className="text-3xl font-light mt-2">{questions[currentStep].question}</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {questions[currentStep].options.map((option) => <button
    key={option.id}
    onClick={() => handleOptionSelect(option.id)}
    className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group ${answers[questions[currentStep].id] === option.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
  >
                                                <div>
                                                    <div className="font-medium">{option.label}</div>
                                                    <div className="text-sm text-muted-foreground">{option.description}</div>
                                                </div>
                                                {answers[questions[currentStep].id] === option.id && <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                                                        <Check size={14} />
                                                    </div>}
                                            </button>)}
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <Button
    variant="ghost"
    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
    disabled={currentStep === 0}
    className="text-muted-foreground"
  >
                                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>
                                        <Button
    onClick={handleNext}
    disabled={!answers[questions[currentStep].id]}
    className="rounded-none px-8"
  >
                                            {currentStep === questions.length - 1 ? "Get Results" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>}
                        </AnimatePresence>
                    </div> : <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center w-full"
  >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                            <Ruler size={40} />
                        </div>
                        <h2 className="text-4xl font-light mb-2">We found your fit!</h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            Based on your answers, we recommend:
                        </p>

                        <Card className="max-w-md mx-auto mb-12 border-primary/20 bg-primary/5">
                            <CardContent className="pt-6 pb-8">
                                <h3 className="text-2xl font-medium mb-2">{getRecommendation()}</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Size M / 32
                                </p>
                                <div className="text-sm">
                                    This fit offers the perfect balance of comfort and style for your body type.
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild className="rounded-none h-12 px-8">
                                <Link to="/category/jeans">Shop {getRecommendation()}</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-none h-12 px-8">
                                <Link to="/">Back to Home</Link>
                            </Button>
                        </div>
                    </motion.div>}
            </main>

            <Footer />
        </div>;
};
var stdin_default = FitQuiz;
export {
  stdin_default as default
};
