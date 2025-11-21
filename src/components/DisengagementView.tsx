import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Pause, Calendar, Share2, Sparkles } from "lucide-react";

interface DisengagementViewProps {
  storiesHeard: number;
  theme: string;
  onChoice: (choice: "pause" | "later" | "share") => void;
}

export function DisengagementView({ storiesHeard, theme, onChoice }: DisengagementViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
      style={{
        background: "linear-gradient(to bottom, #f8f9fa 0%, #e8f0f3 50%, #dce8ed 100%)",
      }}
    >
      <div className="max-w-2xl w-full space-y-10">
        {/* Summary icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 shadow-xl rounded-3xl space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-[1.75rem] leading-snug text-foreground">
                You've listened to {storiesHeard} {storiesHeard === 1 ? "story" : "stories"}
              </h2>
              <p className="text-[1.15rem] text-muted-foreground leading-relaxed">
                Today's theme: {theme}
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-[1.1rem] text-foreground text-center leading-relaxed">
                Would you like to pause or continue later?
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Action options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Button
            size="lg"
            onClick={() => onChoice("pause")}
            className="w-full h-20 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
          >
            <Pause className="w-7 h-7 mr-3" />
            Pause for Now
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onChoice("later")}
            className="w-full h-16 rounded-2xl text-[1.15rem] hover:bg-muted transition-all"
          >
            <Calendar className="w-6 h-6 mr-3" />
            Continue Later
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onChoice("share")}
            className="w-full h-16 rounded-2xl text-[1.15rem] hover:bg-muted transition-all"
          >
            <Share2 className="w-6 h-6 mr-3" />
            Share with Carer
          </Button>
        </motion.div>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center space-y-2"
        >
          <p className="text-muted-foreground text-[1rem] leading-relaxed max-w-lg mx-auto">
            Thank you for taking time to explore these stories today.
          </p>
          <p className="text-muted-foreground text-[0.95rem]">
            We'll remember where you left off.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
