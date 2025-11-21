import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Music, 
  Volume2, 
  Copy,
  Mail,
  Trash2,
  Smartphone,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { toast } from "sonner";

interface Narrative {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  duration: string;
  contentWarning?: string;
  tags: string[];
}

interface PlaylistExportViewProps {
  stories: Narrative[];
  onBack: () => void;
  onRemoveStory: (storyId: string) => void;
}

export function PlaylistExportView({
  stories,
  onBack,
  onRemoveStory,
}: PlaylistExportViewProps) {
  const [playlistName, setPlaylistName] = useState("My Health Narratives Playlist");
  const [exportFormat, setExportFormat] = useState<"json" | "rss" | "csv" | null>(null);

  const calculateTotalDuration = () => {
    const totalMinutes = stories.reduce((acc, story) => {
      const minutes = parseInt(story.duration.split(" ")[0]);
      return acc + minutes;
    }, 0);
    return `${totalMinutes} minutes`;
  };

  const generateJSON = () => {
    return JSON.stringify(
      {
        playlistName,
        createdAt: new Date().toISOString(),
        totalStories: stories.length,
        totalDuration: calculateTotalDuration(),
        stories: stories.map((story) => ({
          id: story.id,
          title: story.title,
          summary: story.summary,
          duration: story.duration,
          tags: story.tags,
          contentWarning: story.contentWarning,
        })),
      },
      null,
      2
    );
  };

  const generateRSS = () => {
    const rssItems = stories
      .map(
        (story) => `
    <item>
      <title>${story.title}</title>
      <description>${story.summary}</description>
      <guid>${story.id}</guid>
      <itunes:duration>${story.duration}</itunes:duration>
      ${story.contentWarning ? `<itunes:explicit>no</itunes:explicit>` : ""}
      ${story.tags.map((tag) => `<category>${tag}</category>`).join("\n      ")}
    </item>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${playlistName}</title>
    <description>A curated playlist of health narratives</description>
    <language>en-us</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    ${rssItems}
  </channel>
</rss>`;
  };

  const generateCSV = () => {
    const headers = "Title,Duration,Summary,Tags,Content Warning\n";
    const rows = stories
      .map((story) => {
        const tags = story.tags.join("; ");
        const summary = story.summary.replace(/"/g, '""');
        const warning = story.contentWarning || "";
        return `"${story.title}","${story.duration}","${summary}","${tags}","${warning}"`;
      })
      .join("\n");
    return headers + rows;
  };

  const handleExport = (format: "json" | "rss" | "csv") => {
    setExportFormat(format);
    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "json":
        content = generateJSON();
        filename = `${playlistName.replace(/\s+/g, "-").toLowerCase()}.json`;
        mimeType = "application/json";
        break;
      case "rss":
        content = generateRSS();
        filename = `${playlistName.replace(/\s+/g, "-").toLowerCase()}.xml`;
        mimeType = "application/rss+xml";
        break;
      case "csv":
        content = generateCSV();
        filename = `${playlistName.replace(/\s+/g, "-").toLowerCase()}.csv`;
        mimeType = "text/csv";
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyShareableLink = () => {
    const storyIds = stories.map((s) => s.id).join(",");
    const shareableLink = `${window.location.origin}/?playlist=${encodeURIComponent(playlistName)}&stories=${storyIds}`;
    navigator.clipboard.writeText(shareableLink);
    toast.success("Shareable link copied to clipboard!");
  };

  const handleShareWithApp = (app: "apple" | "spotify" | "email") => {
    const content = generateRSS();
    const blob = new Blob([content], { type: "application/rss+xml" });
    const url = URL.createObjectURL(blob);
    
    switch (app) {
      case "apple":
        // Apple Podcasts expects a podcast:// URL with RSS feed
        toast.success("Opening Apple Podcasts...");
        toast("Please add this RSS feed to your Apple Podcasts app", {
          description: "We've prepared your playlist file",
          duration: 5000,
        });
        handleExport("rss");
        break;
      case "spotify":
        toast.success("Opening Spotify...");
        toast("Spotify doesn't support custom playlists yet", {
          description: "We've saved a file you can share with Spotify support",
          duration: 5000,
        });
        handleExport("rss");
        break;
      case "email":
        const storyList = stories.map((s, i) => `${i + 1}. ${s.title} (${s.duration})`).join("\n");
        const subject = `Health Narratives Playlist: ${playlistName}`;
        const body = `I'd like to share this playlist of health narratives with you:\n\n${playlistName}\n\nStories (${stories.length}):\n${storyList}\n\nTotal Duration: ${calculateTotalDuration()}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        toast.success("Opening your email app...");
        break;
    }
    
    URL.revokeObjectURL(url);
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Button
            size="lg"
            variant="ghost"
            onClick={onBack}
            className="h-14 px-6 rounded-2xl text-[1.1rem]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-[1.75rem] text-foreground">Create Your Playlist</h1>
              <p className="text-[1rem] text-muted-foreground">
                {stories.length} {stories.length === 1 ? "story" : "stories"} • {calculateTotalDuration()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Playlist Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 rounded-2xl">
            <label htmlFor="playlist-name" className="block text-[1.1rem] text-foreground mb-3">
              Playlist Name
            </label>
            <Input
              id="playlist-name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="h-14 px-5 rounded-xl text-[1.05rem]"
              placeholder="Enter a name for your playlist"
            />
          </Card>
        </motion.div>

        {/* Stories List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-[1.35rem] text-foreground">Stories in Playlist</h2>
          <div className="space-y-3">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className="p-5 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-xl overflow-hidden">
                        <ImageWithFallback
                          src={story.imageUrl}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[1.15rem] text-foreground leading-snug line-clamp-1">
                            {story.title}
                          </h3>
                          <p className="text-[0.95rem] text-muted-foreground line-clamp-2 mt-1">
                            {story.summary}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveStory(story.id)}
                          className="h-9 w-9 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Volume2 className="w-4 h-4" />
                          <span className="text-[0.9rem]">{story.duration}</span>
                        </div>
                        {story.contentWarning && (
                          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[0.8rem]">
                            {story.contentWarning}
                          </Badge>
                        )}
                        {story.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full px-2 py-0.5 text-[0.8rem]"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-[1.35rem] text-foreground">Share Your Playlist</h2>
          
          <Card className="p-6 rounded-2xl space-y-5">
            <p className="text-[1.05rem] text-foreground leading-relaxed">
              Choose how you'd like to listen or share your stories
            </p>

            {/* Simple Share Buttons */}
            <div className="space-y-3">
              {/* Apple Podcasts */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleShareWithApp("apple")}
                className="w-full h-20 rounded-2xl flex items-center justify-between px-6 hover:bg-primary hover:text-primary-foreground transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-[1.15rem]">Listen on Apple Podcasts</div>
                    <div className="text-[0.9rem] opacity-70">Open in your podcast app</div>
                  </div>
                </div>
                <Share2 className="w-5 h-5 opacity-50" />
              </Button>

              {/* Spotify */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleShareWithApp("spotify")}
                className="w-full h-20 rounded-2xl flex items-center justify-between px-6 hover:bg-primary hover:text-primary-foreground transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Music className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-[1.15rem]">Listen on Spotify</div>
                    <div className="text-[0.9rem] opacity-70">Open in Spotify app</div>
                  </div>
                </div>
                <Share2 className="w-5 h-5 opacity-50" />
              </Button>

              {/* Email to Family/Friends */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleShareWithApp("email")}
                className="w-full h-20 rounded-2xl flex items-center justify-between px-6 hover:bg-primary hover:text-primary-foreground transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-[1.15rem]">Email to Family or Friends</div>
                    <div className="text-[0.9rem] opacity-70">Share the list of stories</div>
                  </div>
                </div>
                <Share2 className="w-5 h-5 opacity-50" />
              </Button>

              {/* Save for Later */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleExport("rss")}
                className="w-full h-20 rounded-2xl flex items-center justify-between px-6 hover:bg-primary hover:text-primary-foreground transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                    <Download className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-[1.15rem]">Save to My Device</div>
                    <div className="text-[0.9rem] opacity-70">Download for later</div>
                  </div>
                </div>
                <Download className="w-5 h-5 opacity-50" />
              </Button>
            </div>
          </Card>

          {/* Help Card */}
          <Card className="p-6 rounded-2xl bg-accent/10 border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-[1.15rem] text-foreground">Need Help?</h3>
                <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                  Tap any option above to share your playlist. If you need assistance, 
                  ask a family member or carer to help you listen to these stories.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}