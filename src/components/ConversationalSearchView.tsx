import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Mic, Search, MessageCircle, Send, ChevronUp, ChevronDown, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "system" | "user";
  text: string;
}

interface RecentStory {
  id: string;
  title: string;
  timestamp: string;
  imageUrl: string;
}

interface ConversationalSearchViewProps {
  onStartSearch: (messages: Message[]) => void;
  recentStories?: RecentStory[];
  isReturningUser?: boolean;
  voiceModeActive?: boolean;
  onVoiceToggle?: (isActive: boolean) => void;
}

export function ConversationalSearchView({
  onStartSearch,
  recentStories = [],
  isReturningUser = false,
  voiceModeActive = false,
  onVoiceToggle,
}: ConversationalSearchViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showRecentStories, setShowRecentStories] = useState(true);
  const [showSearchCriteria, setShowSearchCriteria] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Search criteria derived from conversation
  const [searchCriteria, setSearchCriteria] = useState<Array<{ id: string; label: string; reason: string }>>([
    { id: "hopeful", label: "hopeful stories", reason: "you mentioned wanting to feel uplifted" },
    { id: "recovery", label: "about recovery", reason: "you mentioned recovery journeys" },
  ]);

  useEffect(() => {
    // Initial greeting based on context
    if (isReturningUser && recentStories.length > 0) {
      setMessages([
        {
          id: "1",
          sender: "system",
          text: "Welcome back! Would you like to talk about the stories you've heard, or find something new?",
        },
      ]);
    } else {
      setMessages([
        {
          id: "1",
          sender: "system",
          text: "Hello! I'm here to help you find stories. You can talk to me or type your response.",
        },
      ]);
    }
  }, [isReturningUser, recentStories.length]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceClick = () => {
    if (onVoiceToggle) {
      onVoiceToggle(!voiceModeActive);
    }
  };

  const conversationFlow = [
    {
      systemPrompt: "What kind of story would you like today?",
      userResponses: [
        "Something hopeful",
        "About recovery",
        "Something short",
      ],
    },
    {
      systemPrompt: "Would you like this to be about a specific topic?",
      userResponses: [
        "Hospital experiences",
        "Family support",
        "Daily activities",
      ],
    },
    {
      systemPrompt: "Is there anything else you'd like me to know about what you're looking for?",
      userResponses: [
        "Something from someone my age",
        "A positive ending",
        "No, that's everything",
      ],
    },
  ];
  
  // Follow-up responses for continuing conversation
  const followUpResponses = [
    "I understand. That helps me find the right stories for you.",
    "Thank you for sharing that. It gives me a better sense of what you're looking for.",
    "That's helpful to know. I'm getting a clearer picture now.",
    "I appreciate you telling me that. It will help me recommend better stories.",
    "Got it. That's useful information for finding stories you'll connect with.",
  ];

  const handleUserResponse = (response: string) => {
    setHasStarted(true);
    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        sender: "user" as const,
        text: response,
      },
    ];

    if (currentStep < conversationFlow.length - 1) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: "system" as const,
            text: conversationFlow[currentStep + 1].systemPrompt,
          },
        ]);
        setCurrentStep(currentStep + 1);
      }, 500);
      setMessages(newMessages);
    } else {
      // Continue conversation with follow-up responses
      setTimeout(() => {
        const randomResponse = followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: "system" as const,
            text: randomResponse,
          },
        ]);
      }, 500);
      setMessages(newMessages);
    }
  };

  const handleRecentStoryClick = (story: RecentStory) => {
    setHasStarted(true);
    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        sender: "user" as const,
        text: `Tell me more about "${story.title}"`,
      },
      {
        id: (Date.now() + 1).toString(),
        sender: "system" as const,
        text: "I can find similar stories, or we could explore a different angle. What interests you about this one?",
      },
    ];
    setMessages(newMessages);
    setCurrentStep(1);
  };

  const handleNewSearch = () => {
    setHasStarted(true);
    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        sender: "user" as const,
        text: "I'd like to find something new",
      },
      {
        id: (Date.now() + 1).toString(),
        sender: "system" as const,
        text: conversationFlow[0].systemPrompt,
      },
    ];
    setMessages(newMessages);
    setCurrentStep(0);
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (textInput.trim()) {
      handleUserResponse(textInput.trim());
      setTextInput("");
    }
  };

  const hasRecentStories = isReturningUser && recentStories.length > 0;
  
  const removeCriterion = (id: string) => {
    setSearchCriteria(prev => prev.filter(c => c.id !== id));
  };
  
  // Generate discursive explanation
  const generateExplanation = () => {
    if (searchCriteria.length === 0) {
      return "I'll look for stories based on our conversation.";
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
      className="flex flex-col h-screen"
    >
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 overflow-hidden">
        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-12 space-y-6">
          {/* Voice mode indicator */}
          {voiceModeActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-primary/10 border-2 border-primary rounded-2xl flex items-center gap-3"
            >
              <Mic className="w-6 h-6 text-primary animate-pulse" />
              <div>
                <p className="text-[1.1rem] text-primary">Voice mode active</p>
                <p className="text-[0.95rem] text-muted-foreground">I'm listening to you</p>
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          <div className="space-y-6">
          {messages.map((message, index) => {
            const isLastMessage = index === messages.length - 1;
            const isSystemMessage = message.sender === "system";
            const shouldShowButtons = isLastMessage && isSystemMessage && hasStarted && currentStep < conversationFlow.length;
            
            return (
              <div key={message.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex ${
                    message.sender === "system" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-6 rounded-3xl shadow-sm ${
                      message.sender === "system"
                        ? "bg-card text-card-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-[1.25rem] leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
                
                {/* Quick response buttons beneath system message */}
                {shouldShowButtons && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.2 }}
                    className="flex justify-start mt-3"
                  >
                    <div className="flex flex-wrap gap-2 max-w-[80%]">
                      {conversationFlow[currentStep].userResponses.map((response) => (
                        <Button
                          key={response}
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserResponse(response)}
                          className="h-10 px-4 rounded-xl text-[0.95rem] hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                          {response}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
          </div>

          {/* Recent stories prompts */}
          {hasRecentStories && !hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <p className="text-muted-foreground text-[1rem]">
                    Chat about stories you've heard recently
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentStories(!showRecentStories)}
                  className="h-8 px-2 rounded-xl"
                >
                  {showRecentStories ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              {showRecentStories && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {recentStories.slice(0, 3).map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Card
                        className="p-4 hover:shadow-md transition-all cursor-pointer rounded-2xl hover:bg-accent/5 h-full"
                        onClick={() => handleRecentStoryClick(story)}
                      >
                        <div className="flex flex-col gap-3">
                          <ImageWithFallback
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full aspect-video object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <p className="text-[1.05rem] text-foreground">{story.title}</p>
                            <p className="text-muted-foreground mt-1 text-[0.9rem]">
                              {story.timestamp}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed bottom section - Text input, show stories button, search criteria */}
        <div className="flex-shrink-0 px-6 pb-6 pt-4 space-y-4 bg-background border-t border-border/50">
          {/* Text input - always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleTextSubmit}>
              <div className="flex gap-2">
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={voiceModeActive ? "Listening... or type here" : "Type your response..."}
                  className="h-14 px-5 rounded-2xl text-[1.05rem] flex-1"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={!textInput.trim()}
                  className="h-14 w-14 rounded-2xl flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant={voiceModeActive ? "default" : "outline"}
                  onClick={handleVoiceClick}
                  className={`h-14 w-14 rounded-2xl flex-shrink-0 transition-all ${
                    voiceModeActive ? "ring-2 ring-primary ring-offset-2 shadow-lg" : ""
                  }`}
                  aria-label={voiceModeActive ? "Voice mode active" : "Use voice"}
                >
                  <Mic className={`w-5 h-5 ${voiceModeActive ? "animate-pulse" : ""}`} />
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Start search button */}
          {hasStarted && currentStep >= conversationFlow.length - 1 && messages.length > 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Button
                size="lg"
                onClick={() => onStartSearch(messages)}
                className="w-full h-16 rounded-2xl text-[1.25rem] shadow-md hover:shadow-lg transition-all"
              >
                <Search className="w-6 h-6 mr-3" />
                Show Me Stories
              </Button>

              {/* What I will look for - collapsible */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSearchCriteria(!showSearchCriteria)}
                  className="w-full justify-between h-auto py-3 px-4 rounded-xl text-muted-foreground hover:bg-accent/10"
                >
                  <span className="text-[0.95rem]">What I will look for, given what I have learnt</span>
                  {showSearchCriteria ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                {showSearchCriteria && (
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
                        {searchCriteria.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {searchCriteria.map((criterion) => (
                              <Badge
                                key={criterion.id}
                                variant="secondary"
                                className="pl-3 pr-2 py-2 rounded-xl text-[0.9rem] cursor-pointer hover:bg-secondary/80 transition-colors"
                                onClick={() => removeCriterion(criterion.id)}
                              >
                                <span>{criterion.label}</span>
                                <X className="w-3.5 h-3.5 ml-2" />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
