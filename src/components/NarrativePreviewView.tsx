import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Play, SkipForward, Volume2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Narrative {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  duration: string;
  contentWarning?: string;
  tags: string[];
}

interface NarrativePreviewViewProps {
  narrative: Narrative;
  onPlay: () => void;
  onSkip: () => void;
}

export function NarrativePreviewView({ narrative, onPlay, onSkip }: NarrativePreviewViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-2xl w-full space-y-8">
        <Card className="overflow-hidden shadow-xl rounded-3xl">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <ImageWithFallback
              src={narrative.imageUrl}
              alt={narrative.title}
              className="w-full h-full object-cover"
            />
            {narrative.contentWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-4"
              >
                <Badge variant="secondary" className="rounded-full px-4 py-2 text-[0.95rem] shadow-md">
                  {narrative.contentWarning}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-[1.75rem] leading-snug text-foreground">
                {narrative.title}
              </h2>
              <p className="text-[1.15rem] text-muted-foreground leading-relaxed">
                {narrative.summary}
              </p>
            </div>

            {/* Tags and duration */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Volume2 className="w-5 h-5" />
                <span className="text-[1rem]">{narrative.duration}</span>
              </div>
              {narrative.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full px-3 py-1 text-[0.9rem]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            onClick={onPlay}
            className="flex-1 h-16 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
          >
            <Play className="w-6 h-6 mr-3" fill="currentColor" />
            Play Story
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onSkip}
            className="sm:w-auto h-16 px-8 rounded-2xl text-[1.25rem] hover:bg-muted transition-all"
          >
            <SkipForward className="w-6 h-6 mr-3" />
            Skip
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
