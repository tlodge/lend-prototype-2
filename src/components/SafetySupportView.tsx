import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Coffee, Flower2, Phone, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SafetySupportViewProps {
  onChoice: (choice: "break" | "calm" | "support" | "back") => void;
}

export function SafetySupportView({ onChoice }: SafetySupportViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
      style={{
        background: "linear-gradient(to bottom, #f8f9fa 0%, #e8f4f8 100%)",
      }}
    >
      <div className="max-w-2xl w-full space-y-10">
        {/* Calm message */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
            <Flower2 className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-[1.75rem] leading-snug text-foreground">
            It's okay to pause
          </h2>
          <p className="text-[1.15rem] text-muted-foreground leading-relaxed">
            Would you like a break, a calm activity, or support info?
          </p>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded-2xl"
            onClick={() => onChoice("break")}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Coffee className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-[1.25rem] text-foreground">Take a Break</h3>
                <p className="text-muted-foreground text-[1rem] leading-relaxed">
                  Step away for a moment. We'll be here when you're ready.
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded-2xl"
            onClick={() => onChoice("calm")}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Flower2 className="w-7 h-7 text-accent" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-[1.25rem] text-foreground">Calm Activity</h3>
                <p className="text-muted-foreground text-[1rem] leading-relaxed">
                  Try a gentle breathing exercise or calming visualization.
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer rounded-2xl"
            onClick={() => onChoice("support")}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0">
                <Phone className="w-7 h-7 text-secondary" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-[1.25rem] text-foreground">Support Info</h3>
                <p className="text-muted-foreground text-[1rem] leading-relaxed">
                  View helpline numbers and support resources.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            variant="ghost"
            onClick={() => onChoice("back")}
            className="h-14 px-8 rounded-2xl text-[1.1rem]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
