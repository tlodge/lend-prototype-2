import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Pause, Play, SkipBack, SkipForward, Mic, Heart, HelpCircle, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface PlaybackReflectionViewProps {
  narrativeTitle: string;
  duration: string;
  onReflection: (response: "helpful" | "unsure" | "distressing" | "dislike") => void;
}

export function PlaybackReflectionView({
  narrativeTitle,
  duration,
  onReflection,
}: PlaybackReflectionViewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showReflection, setShowReflection] = useState(false);

  // Simulate playback progress
  useState(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowReflection(true), 500);
          setIsPlaying(false);
          return 100;
        }
        return prev + 2;
      });
    }, 300);

    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = Math.floor((progress / 100) * 180);
  const totalTime = 180;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-2xl w-full space-y-12">
        {!showReflection ? (
          <>
            {/* Playback card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <Card className="p-10 shadow-xl rounded-3xl space-y-8">
                {/* Title */}
                <div className="text-center space-y-2">
                  <h2 className="text-[1.75rem] leading-snug text-foreground">
                    {narrativeTitle}
                  </h2>
                  <p className="text-muted-foreground text-[1.1rem]">
                    {duration}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-3">
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-muted-foreground text-[1rem]">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalTime)}</span>
                  </div>
                </div>

                {/* Playback controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-14 h-14 rounded-full"
                  >
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-14 h-14 rounded-full"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                {/* I don't like this button */}
                <div className="mt-6">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onReflection("dislike")}
                    className="w-full h-16 rounded-2xl text-[1.1rem] hover:bg-muted transition-all"
                  >
                    <X className="w-5 h-5 mr-2" />
                    I don't like this
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Visual feedback */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-12 bg-primary/30 rounded-full"
                      animate={{
                        scaleY: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <>
            {/* Reflection prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <h2 className="text-[1.75rem] leading-snug text-foreground">
                How did this make you feel?
              </h2>
              <p className="text-muted-foreground text-[1.15rem]">
                Your feedback helps us find better stories for you
              </p>
            </motion.div>

            {/* Reflection options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                onClick={() => onReflection("helpful")}
                className="w-full h-20 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all bg-accent hover:bg-accent/90"
              >
                <Heart className="w-7 h-7 mr-3" />
                Helpful
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onReflection("unsure")}
                className="w-full h-20 rounded-2xl text-[1.25rem] hover:bg-muted transition-all"
              >
                <HelpCircle className="w-7 h-7 mr-3" />
                Unsure
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onReflection("distressing")}
                className="w-full h-20 rounded-2xl text-[1.25rem] hover:bg-muted transition-all"
              >
                <AlertTriangle className="w-7 h-7 mr-3" />
                Distressing
              </Button>
            </motion.div>

            {/* Voice option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                variant="ghost"
                className="w-16 h-16 rounded-full"
                aria-label="Use voice"
              >
                <Mic className="w-7 h-7" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
