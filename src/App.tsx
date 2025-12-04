import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import html2canvas from "html2canvas";
import { broadcastViewChange, broadcastStorySelect, broadcastStoryReflection, broadcastMenuAction, broadcastScreenshot } from "./utils/iframeEvents";
import { FloatingMenu } from "./components/FloatingMenu";
import { WelcomeView } from "./components/WelcomeView";
import { ConversationalSearchView } from "./components/ConversationalSearchView";
import { StoriesLibraryView } from "./components/StoriesLibraryView";
import { PlaybackReflectionView } from "./components/PlaybackReflectionView";
import { SafetySupportView } from "./components/SafetySupportView";
import { PersonalizationView } from "./components/PersonalizationView";
import { DisengagementView } from "./components/DisengagementView";
import { CalmActivityView } from "./components/CalmActivityView";
import { PlaylistExportView } from "./components/PlaylistExportView";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

type ViewType =
  | "welcome"
  | "search"
  | "library"
  | "playback"
  | "safety"
  | "personalization"
  | "disengagement"
  | "calm"
  | "playlist";

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

interface ViewedStory {
  id: string;
  title: string;
  timestamp: string;
  imageUrl: string;
}

const mockNarratives: Narrative[] = [
  {
    id: "1",
    title: "Finding Joy in Small Moments",
    summary:
      "Sarah shares how she learned to appreciate simple daily activities during her recovery journey.",
    imageUrl:
      "https://images.unsplash.com/photo-1636893580433-5ac59809bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjI3ODc0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    duration: "3 minutes",
    tags: ["Hopeful", "Daily Life"],
    reasoning: "This story matches your interest in hopeful narratives about daily life. Sarah's experience focuses on finding meaning in everyday moments, which aligns with your search for uplifting recovery stories.",
  },
  {
    id: "2",
    title: "The Power of Family Support",
    summary:
      "Michael talks about how his family helped him through challenging hospital stays.",
    imageUrl:
      "https://images.unsplash.com/photo-1710074213379-2a9c2653046a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJpbmclMjBob3NwaXRhbCUyMHJlY292ZXJ5fGVufDF8fHx8MTc2Mjc5MTM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    duration: "5 minutes",
    contentWarning: "Mentions hospital stays",
    tags: ["Family", "Support"],
    reasoning: "You mentioned interest in family support themes. This story explores how loved ones can make a difference during difficult times in healthcare settings.",
  },
  {
    id: "3",
    title: "Rediscovering Old Hobbies",
    summary:
      "Emma describes returning to painting and how it helped her reconnect with herself.",
    imageUrl:
      "https://images.unsplash.com/photo-1636893580433-5ac59809bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjI3ODc0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    duration: "4 minutes",
    tags: ["Hopeful", "Activities"],
    reasoning: "This story highlights meaningful activities and personal reconnection. It relates to your search for hopeful stories about daily activities and personal growth.",
  },
  {
    id: "4",
    title: "A Journey Through Uncertainty",
    summary:
      "David reflects on finding peace and acceptance during difficult medical transitions.",
    imageUrl:
      "https://images.unsplash.com/photo-1636893580433-5ac59809bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG5hdHVyZSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjI3ODc0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    duration: "6 minutes",
    contentWarning: "Mentions medical procedures",
    tags: ["Acceptance", "Recovery"],
    reasoning: "This narrative offers perspectives on finding peace during challenging health transitions. It complements your interest in recovery stories with a focus on emotional acceptance.",
  },
  {
    id: "5",
    title: "Community Connections",
    summary:
      "Lisa talks about the unexpected friendships she made through support groups.",
    imageUrl:
      "https://images.unsplash.com/photo-1710074213379-2a9c2653046a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJpbmclMjBob3NwaXRhbCUyMHJlY292ZXJ5fGVufDF8fHx8MTc2Mjc5MTM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    duration: "4 minutes",
    tags: ["Community", "Support"],
    reasoning: "This story explores the importance of community and shared experiences. It connects to your interest in support systems and how relationships contribute to healing.",
  },
];

interface SearchCriterion {
  id: string;
  label: string;
  reason: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("search");
  const [viewedStories, setViewedStories] = useState<ViewedStory[]>([]);
  const [currentlyPlayingStory, setCurrentlyPlayingStory] = useState<Narrative | null>(null);
  const [voiceModeActive, setVoiceModeActive] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriterion[]>([
    { id: "hopeful", label: "hopeful stories", reason: "you mentioned wanting to feel uplifted" },
    { id: "recovery", label: "about recovery", reason: "you mentioned recovery journeys" },
  ]);
  const [playlistStories, setPlaylistStories] = useState<Narrative[]>([]);

  const handleStartSearch = () => {
    setCurrentView("library");
  };

  const handleVoiceToggle = (isActive: boolean) => {
    setVoiceModeActive(isActive);
  };

  const handleBackToConversation = () => {
    setCurrentView("search");
  };

  const handleSelectStory = (story: Narrative) => {
    setCurrentlyPlayingStory(story);
    setCurrentView("playback");
    broadcastStorySelect(story.id, story.title);
  };

  const handleReflection = (response: "helpful" | "unsure" | "distressing" | "dislike") => {
    // Broadcast reflection event
    if (currentlyPlayingStory) {
      broadcastStoryReflection(currentlyPlayingStory.id, response);
    }

    // Add to viewed stories (except for dislike)
    if (currentlyPlayingStory && response !== "dislike") {
      const newViewedStory: ViewedStory = {
        id: currentlyPlayingStory.id,
        title: currentlyPlayingStory.title,
        timestamp: "Just now",
        imageUrl: currentlyPlayingStory.imageUrl,
      };
      setViewedStories((prev) => {
        // Avoid duplicates
        const filtered = prev.filter((s) => s.id !== newViewedStory.id);
        return [newViewedStory, ...filtered];
      });
    }

    if (response === "dislike") {
      setCurrentView("search");
      return;
    }

    if (response === "distressing") {
      setCurrentView("safety");
    } else if (response === "helpful") {
      toast.success("Thank you for sharing your feedback");
      // Return to conversational interface
      setTimeout(() => {
        if (viewedStories.length >= 2) {
          setCurrentView("personalization");
        } else {
          setCurrentView("search");
        }
      }, 1000);
    } else {
      toast("We'll find better stories for you");
      // Return to conversational interface
      setTimeout(() => setCurrentView("search"), 1000);
    }
  };

  const handleSafetyChoice = (
    choice: "break" | "calm" | "support" | "back"
  ) => {
    if (choice === "calm") {
      setCurrentView("calm");
    } else if (choice === "back") {
      setCurrentView("search");
    } else if (choice === "break") {
      setCurrentView("disengagement");
    } else if (choice === "support") {
      toast.info("Support resources would be displayed here");
      setTimeout(() => setCurrentView("search"), 2000);
    }
  };

  const handleCalmBack = () => {
    setCurrentView("search");
  };

  const handlePersonalizationConfirm = () => {
    toast.success("Preferences saved");
    setTimeout(() => setCurrentView("search"), 1000);
  };

  const handlePersonalizationChange = () => {
    toast("Let's adjust your preferences");
    setCurrentView("search");
  };

  const handleDisengagementChoice = (
    choice: "pause" | "later" | "share"
  ) => {
    if (choice === "pause") {
      toast("See you next time");
      setTimeout(() => {
        setCurrentView("search");
      }, 2000);
    } else if (choice === "later") {
      toast("We'll save your progress");
      setTimeout(() => {
        setCurrentView("search");
      }, 2000);
    } else if (choice === "share") {
      toast.success("Sharing options would be displayed here");
      setTimeout(() => setCurrentView("search"), 2000);
    }
  };

  const handleWhyResponse = (storyId: string, response: string) => {
    toast.success("Thank you for your question. We'll refine your recommendations.");
    console.log(`User asked about story ${storyId}: ${response}`);
    // Here you would integrate with your recommendation system
  };

  const handleRemoveCriterion = (id: string) => {
    setSearchCriteria((prev) => prev.filter((c) => c.id !== id));
    toast("Search criteria updated");
  };

  const handleGeneratePlaylist = (criteria: SearchCriterion[]) => {
    toast.success("Generating daily playlist based on your preferences...");
    console.log("Generating playlist with criteria:", criteria);
    // Auto-generate playlist from all matching stories
    setPlaylistStories(mockNarratives);
    setCurrentView("playlist");
  };

  const handleCreatePlaylist = (stories: Narrative[]) => {
    if (stories.length === 0) {
      toast.error("Please select at least one story");
      return;
    }
    toast.success(`Creating playlist with ${stories.length} ${stories.length === 1 ? "story" : "stories"}...`);
    setPlaylistStories(stories);
    setCurrentView("playlist");
  };

  const handleRemoveFromPlaylist = (storyId: string) => {
    setPlaylistStories((prev) => prev.filter((s) => s.id !== storyId));
    toast("Story removed from playlist");
  };

  const handleBackFromPlaylist = () => {
    setCurrentView("library");
  };

  const handleMenuAction = (action: string) => {
    broadcastMenuAction(action);
    
    switch (action) {
      case "settings":
        toast("Settings would open here");
        break;
      case "history":
        if (viewedStories.length > 0) {
          toast("Showing your story history");
          setCurrentView("search");
        } else {
          toast("You haven't watched any stories yet");
        }
        break;
      case "help":
        toast("Help and support information would be displayed here");
        break;
      case "exit":
        if (confirm("Are you sure you want to exit?")) {
          if (viewedStories.length > 0) {
            setCurrentView("disengagement");
          } else {
            setCurrentView("search");
            setViewedStories([]);
          }
        }
        break;
    }
  };

  // Get recommended and other stories for library
  const recommendedStory = mockNarratives[0];
  const otherStories = mockNarratives.slice(1);

  // Broadcast view changes to parent window
  useEffect(() => {
    broadcastViewChange(currentView, {
      viewedStoriesCount: viewedStories.length,
      currentlyPlayingStory: currentlyPlayingStory?.title,
      voiceModeActive,
    });
  }, [currentView, viewedStories.length, currentlyPlayingStory?.title, voiceModeActive]);

  // Listen for screenshot requests from parent window
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'request-screenshot') {
        try {
          // Capture the entire document body
          const canvas = await html2canvas(document.body, {
            allowTaint: true,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          });
          
          // Convert to base64 and send back
          const imageData = canvas.toDataURL('image/png');
          broadcastScreenshot(imageData);
        } catch (error) {
          console.error('Error capturing screenshot:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentView === "search" && (
          <ConversationalSearchView
            key="search"
            onStartSearch={handleStartSearch}
            recentStories={viewedStories}
            isReturningUser={viewedStories.length > 0}
            voiceModeActive={voiceModeActive}
            onVoiceToggle={handleVoiceToggle}
          />
        )}

        {currentView === "library" && (
          <StoriesLibraryView
            key="library"
            recommendedStory={recommendedStory}
            otherStories={otherStories}
            onSelectStory={handleSelectStory}
            onBackToConversation={handleBackToConversation}
            onWhyResponse={handleWhyResponse}
            searchContext="Looking for hopeful stories about recovery"
            searchCriteria={searchCriteria}
            onRemoveCriterion={handleRemoveCriterion}
            onGeneratePlaylist={handleGeneratePlaylist}
            onCreatePlaylist={handleCreatePlaylist}
          />
        )}

        {currentView === "playback" && currentlyPlayingStory && (
          <PlaybackReflectionView
            key="playback"
            narrativeTitle={currentlyPlayingStory.title}
            duration={currentlyPlayingStory.duration}
            onReflection={handleReflection}
          />
        )}

        {currentView === "safety" && (
          <SafetySupportView
            key="safety"
            onChoice={handleSafetyChoice}
          />
        )}

        {currentView === "calm" && (
          <CalmActivityView key="calm" onBack={handleCalmBack} />
        )}

        {currentView === "personalization" && (
          <PersonalizationView
            key="personalization"
            preference="You seem to prefer short hopeful stories about daily activities"
            onConfirm={handlePersonalizationConfirm}
            onChange={handlePersonalizationChange}
          />
        )}

        {currentView === "disengagement" && (
          <DisengagementView
            key="disengagement"
            storiesHeard={viewedStories.length}
            theme="Recovery and Hope"
            onChoice={handleDisengagementChoice}
          />
        )}

        {currentView === "playlist" && (
          <PlaylistExportView
            key="playlist"
            stories={playlistStories}
            onBack={handleBackFromPlaylist}
            onRemoveStory={handleRemoveFromPlaylist}
          />
        )}
      </AnimatePresence>

      <FloatingMenu
        onSettings={() => handleMenuAction("settings")}
        onHistory={() => handleMenuAction("history")}
        onHelp={() => handleMenuAction("help")}
        onExit={() => handleMenuAction("exit")}
      />

      <Toaster position="top-center" />
    </div>
  );
}