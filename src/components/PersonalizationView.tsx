import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, Settings } from "lucide-react";

interface PersonalizationViewProps {
  preference: string;
  onConfirm: () => void;
  onChange: () => void;
}

export function PersonalizationView({ preference, onConfirm, onChange }: PersonalizationViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-2xl w-full space-y-10">
        {/* Learning indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Settings className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        {/* Preference summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 shadow-lg rounded-3xl space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-[1.75rem] leading-snug text-foreground">
                We're learning your preferences
              </h2>
              <p className="text-[1.15rem] text-muted-foreground leading-relaxed">
                {preference}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[1.1rem] text-foreground text-center">
                Keep showing these types of stories?
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Confirmation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Button
            size="lg"
            onClick={onConfirm}
            className="w-full h-20 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
          >
            <Check className="w-7 h-7 mr-3" />
            Yes, Continue
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onChange}
            className="w-full h-16 rounded-2xl text-[1.15rem] hover:bg-muted transition-all"
          >
            <Settings className="w-6 h-6 mr-3" />
            Change Preferences
          </Button>
        </motion.div>

        {/* Transparency note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-[0.95rem] leading-relaxed max-w-lg mx-auto">
            Your preferences help us find stories that are most meaningful to you.
            You can change these anytime in Settings.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
