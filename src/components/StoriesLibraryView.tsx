import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Play, ArrowLeft, Volume2, Star, HelpCircle, Send, ChevronUp, ChevronDown, X, List, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface Narrative {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  duration: string;
  contentWarning?: string;
  tags: string[];
  reasoning?: string;
}

interface SearchCriterion {
  id: string;
  label: string;
  reason: string;
}

interface StoriesLibraryViewProps {
  recommendedStory: Narrative;
  otherStories: Narrative[];
  onSelectStory: (story: Narrative) => void;
  onBackToConversation: () => void;
  onWhyResponse?: (storyId: string, response: string) => void;
  searchContext?: string;
  searchCriteria?: SearchCriterion[];
  onRemoveCriterion?: (id: string) => void;
  onGeneratePlaylist?: (criteria: SearchCriterion[]) => void;
  onCreatePlaylist?: (stories: Narrative[]) => void;
}

export function StoriesLibraryView({
  recommendedStory,
  otherStories,
  onSelectStory,
  onBackToConversation,
  onWhyResponse,
  searchContext,
  searchCriteria = [],
  onRemoveCriterion,
  onGeneratePlaylist,
  onCreatePlaylist,
}: StoriesLibraryViewProps) {
  const [expandedWhy, setExpandedWhy] = useState<string | null>(null);
  const [whyResponse, setWhyResponse] = useState("");
  const [showSearchSummary, setShowSearchSummary] = useState(true);
  const [selectedStories, setSelectedStories] = useState<Set<string>>(new Set());

  const handleWhyToggle = (storyId: string) => {
    setExpandedWhy(expandedWhy === storyId ? null : storyId);
    setWhyResponse("");
  };

  const handleWhySubmit = (storyId: string, e?: React.FormEvent) => {
    e?.preventDefault();
    if (whyResponse.trim() && onWhyResponse) {
      onWhyResponse(storyId, whyResponse.trim());
      setWhyResponse("");
      setExpandedWhy(null);
    }
  };

  const handleToggleStorySelection = (storyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const handleCreatePlaylistFromSelection = () => {
    const allStories = [recommendedStory, ...otherStories];
    const selected = allStories.filter((story) => selectedStories.has(story.id));
    if (onCreatePlaylist) {
      onCreatePlaylist(selected);
    }
  };

  // Generate discursive explanation from criteria
  const generateExplanation = () => {
    if (searchCriteria.length === 0) {
      return "I've found these stories based on our conversation.";
    }
    
    const explanations = searchCriteria.map((criterion, index) => {
      const connector = index === 0 ? "Because" : "and because";
      return `${connector} ${criterion.reason}, I've included ${criterion.label}`;
    });
    
    return explanations.join(", ") + ".";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen px-6 py-12"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            size="lg"
            variant="ghost"
            onClick={onBackToConversation}
            className="h-14 px-6 rounded-2xl text-[1.1rem]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </Button>
          {searchContext && (
            <p className="text-muted-foreground text-[1rem] italic max-w-md text-right">
              {searchContext}
            </p>
          )}
        </motion.div>

        {/* Search Summary Section */}
        {searchCriteria.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <Button
              variant="ghost"
              onClick={() => setShowSearchSummary(!showSearchSummary)}
              className="w-full justify-between h-auto py-3 px-4 rounded-xl text-muted-foreground hover:bg-accent/10"
            >
              <span className="text-[0.95rem]">What I looked for, based on what I learnt</span>
              {showSearchSummary ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            <AnimatePresence>
              {showSearchSummary && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="p-5 rounded-2xl bg-accent/10 border-accent/20">
                    <div className="space-y-4">
                      {/* Discursive explanation */}
                      <p className="text-foreground leading-relaxed text-[1rem]">
                        {generateExplanation()}
                      </p>

                      {/* Removable criteria chips */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {searchCriteria.map((criterion) => (
                          <Badge
                            key={criterion.id}
                            variant="secondary"
                            className="pl-3 pr-2 py-2 rounded-xl text-[0.9rem] cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => onRemoveCriterion?.(criterion.id)}
                          >
                            <span>{criterion.label}</span>
                            <X className="w-3.5 h-3.5 ml-2" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Selection toolbar - appears when stories are selected */}
        <AnimatePresence>
          {selectedStories.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-4 z-10"
            >
              <Card className="p-5 rounded-2xl bg-primary/10 border-primary/20 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-[1.1rem] text-foreground">
                        {selectedStories.size} {selectedStories.size === 1 ? "story" : "stories"} selected
                      </p>
                      <p className="text-[0.9rem] text-muted-foreground">
                        Ready to create your playlist
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedStories(new Set())}
                      className="h-12 px-5 rounded-xl text-[0.95rem]"
                    >
                      Clear
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleCreatePlaylistFromSelection}
                      className="h-12 px-5 rounded-xl text-[0.95rem] shadow-md"
                    >
                      <List className="w-5 h-5 mr-2" />
                      Create Playlist
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recommended Story (Large) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary fill-primary" />
              <h2 className="text-[1.5rem] text-foreground">Recommended for You</h2>
            </div>
            {onGeneratePlaylist && searchCriteria.length > 0 && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => onGeneratePlaylist(searchCriteria)}
                className="h-12 px-5 rounded-xl text-[0.95rem] hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <List className="w-5 h-5 mr-2" />
                Generate Daily Playlist
              </Button>
            )}
          </div>

          <Card
            className="overflow-hidden shadow-xl rounded-3xl hover:shadow-2xl transition-shadow relative"
          >
            {/* Selection checkbox */}
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={(e) => handleToggleStorySelection(recommendedStory.id, e)}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all shadow-lg ${
                  selectedStories.has(recommendedStory.id)
                    ? "bg-primary border-primary"
                    : "bg-white/90 border-white/90 hover:bg-primary/10"
                }`}
              >
                {selectedStories.has(recommendedStory.id) && (
                  <Check className="w-6 h-6 text-primary-foreground" />
                )}
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <ImageWithFallback
                src={recommendedStory.imageUrl}
                alt={recommendedStory.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              {recommendedStory.contentWarning && (
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="rounded-full px-4 py-2 text-[0.95rem] shadow-md"
                  >
                    {recommendedStory.contentWarning}
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-[1.75rem] leading-tight mb-2">
                  {recommendedStory.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <p className="text-[1.15rem] text-muted-foreground leading-relaxed">
                {recommendedStory.summary}
              </p>

              {/* Why this story button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhyToggle(recommendedStory.id);
                }}
                className="h-10 px-4 rounded-xl text-[0.95rem] text-primary hover:text-primary hover:bg-primary/10"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Why this story?
              </Button>

              {/* Expanded why section */}
              <AnimatePresence>
                {expandedWhy === recommendedStory.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <Card className="p-5 bg-muted/50 rounded-2xl space-y-4">
                      <p className="text-[1rem] text-foreground leading-relaxed">
                        {recommendedStory.reasoning || 
                          "This story matches your interest in hopeful narratives about daily life and recovery. It features themes similar to what you've enjoyed before."}
                      </p>
                      <form onSubmit={(e) => handleWhySubmit(recommendedStory.id, e)} className="space-y-3">
                        <Input
                          value={whyResponse}
                          onChange={(e) => setWhyResponse(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="Am I wrong about any of this?"
                          className="h-12 px-4 rounded-xl text-[1rem]"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={!whyResponse.trim()}
                          className="h-10 px-5 rounded-xl text-[0.95rem]"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Feedback
                        </Button>
                      </form>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tags and duration */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Volume2 className="w-5 h-5" />
                  <span className="text-[1rem]">{recommendedStory.duration}</span>
                </div>
                {recommendedStory.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full px-3 py-1 text-[0.9rem]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full h-16 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStory(recommendedStory);
                }}
              >
                <Play className="w-6 h-6 mr-3" fill="currentColor" />
                Play Story
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Other Stories */}
        {otherStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-[1.35rem] text-foreground">Other Stories You Might Like</h2>

            <div className="grid gap-6 sm:grid-cols-2">
              {otherStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden shadow-md rounded-2xl hover:shadow-xl transition-all h-full relative"
                  >
                    {/* Selection checkbox */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        onClick={(e) => handleToggleStorySelection(story.id, e)}
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all shadow-md ${
                          selectedStories.has(story.id)
                            ? "bg-primary border-primary"
                            : "bg-white/90 border-white/90 hover:bg-primary/10"
                        }`}
                      >
                        {selectedStories.has(story.id) && (
                          <Check className="w-5 h-5 text-primary-foreground" />
                        )}
                      </button>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <ImageWithFallback
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      {story.contentWarning && (
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant="secondary"
                            className="rounded-full px-3 py-1 text-[0.85rem] shadow-md"
                          >
                            {story.contentWarning}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-[1.25rem] text-foreground leading-snug line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-[1rem] text-muted-foreground leading-relaxed line-clamp-2">
                        {story.summary}
                      </p>

                      {/* Why this story button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhyToggle(story.id);
                        }}
                        className="h-8 px-3 rounded-lg text-[0.9rem] text-primary hover:text-primary hover:bg-primary/10 -ml-3"
                      >
                        <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                        Why?
                      </Button>

                      {/* Expanded why section */}
                      <AnimatePresence>
                        {expandedWhy === story.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <Card className="p-4 bg-muted/50 rounded-xl space-y-3">
                              <p className="text-[0.95rem] text-foreground leading-relaxed">
                                {story.reasoning || 
                                  "This story shares similar themes with your search and may offer a perspective you'll find meaningful."}
                              </p>
                              <form onSubmit={(e) => handleWhySubmit(story.id, e)} className="space-y-2">
                                <Input
                                  value={whyResponse}
                                  onChange={(e) => setWhyResponse(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  placeholder="Am I wrong about any of this?"
                                  className="h-10 px-3 rounded-lg text-[0.95rem]"
                                />
                                <Button
                                  type="submit"
                                  size="sm"
                                  disabled={!whyResponse.trim()}
                                  className="h-9 px-4 rounded-lg text-[0.9rem]"
                                >
                                  <Send className="w-3.5 h-3.5 mr-1.5" />
                                  Feedback
                                </Button>
                              </form>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tags and duration */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Volume2 className="w-4 h-4" />
                          <span className="text-[0.9rem]">{story.duration}</span>
                        </div>
                        {story.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full px-2 py-0.5 text-[0.85rem]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full h-12 rounded-xl text-[1rem] hover:bg-primary hover:text-primary-foreground transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStory(story);
                        }}
                      >
                        <Play className="w-5 h-5 mr-2" fill="currentColor" />
                        Play
                      </Button>
                    </div>
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