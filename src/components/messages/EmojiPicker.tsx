
import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

// Basic set of commonly used emojis
const emojiCategories = {
  "Smileys & People": ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "🤭"],
  "Animals & Nature": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦄", "🦋", "🐌", "🐞"],
  "Food & Drink": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🌮", "🍕", "🍔", "🍟"],
  "Activities": ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥅", "🏒", "🏑", "🥍", "🏏", "🪃", "🥊", "🥋", "🎭", "🎨", "🎬"],
  "Travel & Places": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚚", "🚛", "🚜", "🛴", "🚲", "🛵", "🏍️", "🚂", "✈️", "🚀", "🚁", "🚢", "🛳️"],
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Smileys & People");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={pickerRef}>
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 p-2 rounded-full hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Smile size={20} />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 w-64 z-50">
          <div className="p-2">
            <div className="flex overflow-x-auto space-x-2 pb-2 mb-2 border-b">
              {Object.keys(emojiCategories).map((category) => (
                <button
                  key={category}
                  className={`p-1 rounded-md whitespace-nowrap ${
                    activeCategory === category ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.split(' ')[0]}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 max-h-60 overflow-y-auto">
              {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji) => (
                <button
                  key={emoji}
                  className="p-1 text-xl hover:bg-gray-100 rounded"
                  onClick={() => {
                    onEmojiSelect(emoji);
                    setIsOpen(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
