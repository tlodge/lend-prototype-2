import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Flower2, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

interface CalmActivityViewProps {
  onBack: () => void;
}

export function CalmActivityView({ onBack }: CalmActivityViewProps) {
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setBreathPhase((phase) => {
            if (phase === "inhale") return "hold";
            if (phase === "hold") return "exhale";
            return "inhale";
          });
          return phase === "hold" ? 7 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathPhase]);

  const getPhaseText = () => {
    switch (breathPhase) {
      case "inhale":
        return "Breathe in";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe out";
    }
  };

  const getPhaseColor = () => {
    switch (breathPhase) {
      case "inhale":
        return "#5a9fb8";
      case "hold":
        return "#7bb89d";
      case "exhale":
        return "#a8c7d9";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12 relative"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758274539654-23fa349cc090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwY2FsbSUyMGFjdGl2aXR5fGVufDF8fHx8MTc2Mjc5MTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Calm background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <div className="max-w-2xl w-full space-y-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mx-auto">
            <Flower2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-[1.75rem] text-foreground">
            Breathing Exercise
          </h2>
          <p className="text-muted-foreground text-[1.1rem]">
            Follow the circle and breathe with the rhythm
          </p>
        </motion.div>

        {/* Breathing circle */}
        <div className="flex flex-col items-center gap-8">
          <motion.div
            className="w-64 h-64 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              scale: breathPhase === "inhale" ? 1.2 : breathPhase === "hold" ? 1.2 : 0.8,
              backgroundColor: getPhaseColor(),
            }}
            transition={{
              duration: breathPhase === "hold" ? 7 : 4,
              ease: "easeInOut",
            }}
          >
            <div className="text-center space-y-2">
              <p className="text-white text-[1.75rem]">{getPhaseText()}</p>
              <p className="text-white/90 text-[3rem]">{countdown}</p>
            </div>
          </motion.div>

          <Card className="p-6 rounded-2xl bg-card/80 backdrop-blur">
            <p className="text-center text-muted-foreground text-[1rem] leading-relaxed">
              Take your time. There's no rush.
            </p>
          </Card>
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            variant="secondary"
            onClick={onBack}
            className="h-16 px-10 rounded-2xl text-[1.15rem] shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            I'm Ready
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
