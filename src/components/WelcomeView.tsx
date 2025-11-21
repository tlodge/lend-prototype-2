import { motion } from "motion/react";
import { Button } from "./ui/button";
import { MessageSquare, BookOpen, Accessibility } from "lucide-react";
import { Card } from "./ui/card";

interface WelcomeViewProps {
  onSelectMode: (mode: "talk" | "read") => void;
  previousStories?: Array<{ id: string; title: string; timestamp: string }>;
}

export function WelcomeView({ onSelectMode, previousStories }: WelcomeViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-2xl w-full space-y-12">
        {/* Accessibility indicator */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Accessibility className="w-6 h-6 text-accent" />
          </div>
        </motion.div>

        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-6"
        >
          <h1 className="text-[2rem] leading-relaxed text-foreground">
            I can help you explore real stories
          </h1>
          <p className="text-[1.25rem] text-muted-foreground leading-relaxed">
            Would you like to begin by talking or reading?
          </p>
        </motion.div>

        {/* Mode selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Button
            size="lg"
            onClick={() => onSelectMode("talk")}
            className="h-20 px-12 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
          >
            <MessageSquare className="w-7 h-7 mr-3" />
            Talk
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onSelectMode("read")}
            className="h-20 px-12 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
          >
            <BookOpen className="w-7 h-7 mr-3" />
            Read
          </Button>
        </motion.div>

        {/* Previous stories */}
        {previousStories && previousStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 space-y-4"
          >
            <p className="text-center text-muted-foreground text-[1.1rem]">
              Or revisit a story you've heard
            </p>
            <div className="space-y-3">
              {previousStories.slice(0, 3).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer rounded-2xl">
                    <p className="text-[1.1rem] text-foreground">{story.title}</p>
                    <p className="text-muted-foreground mt-1">{story.timestamp}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
