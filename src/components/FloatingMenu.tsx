import { Settings, BookOpen, HelpCircle, Power } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface FloatingMenuProps {
  onSettings?: () => void;
  onHistory?: () => void;
  onHelp?: () => void;
  onExit?: () => void;
}

export function FloatingMenu({ onSettings, onHistory, onHelp, onExit }: FloatingMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: Settings, label: "Settings", onClick: onSettings },
    { icon: BookOpen, label: "History", onClick: onHistory },
    { icon: HelpCircle, label: "Help", onClick: onHelp },
    { icon: Power, label: "Exit", onClick: onExit },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 mb-3"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => {
                    item.onClick?.();
                    setIsExpanded(false);
                  }}
                  aria-label={item.label}
                >
                  <item.icon className="w-6 h-6" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        variant={isExpanded ? "default" : "secondary"}
        className="w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Close menu" : "Open menu"}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Power className="w-7 h-7" />
        </motion.div>
      </Button>
    </div>
  );
}
