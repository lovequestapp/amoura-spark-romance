
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface MatchFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  ageRange: [number, number];
  distance: number;
  showVerifiedOnly: boolean;
  interests: string[];
  relationshipIntention: string | null;
}

const defaultFilters: FilterOptions = {
  ageRange: [21, 35],
  distance: 25,
  showVerifiedOnly: false,
  interests: [],
  relationshipIntention: null,
};

const interests = ["Travel", "Music", "Fitness", "Food", "Art", "Movies", "Reading", "Gaming", "Outdoors", "Photography"];
const intentions = ["Casual", "Dating", "Relationship", "Marriage"];

const MatchFilters: React.FC<MatchFiltersProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleAgeRangeChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      ageRange: [values[0], values[1]]
    }));
  };

  const handleDistanceChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      distance: values[0]
    }));
  };

  const toggleVerified = () => {
    setFilters(prev => ({
      ...prev,
      showVerifiedOnly: !prev.showVerifiedOnly
    }));
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const selectIntention = (intention: string) => {
    if (selectedIntention === intention) {
      setSelectedIntention(null);
    } else {
      setSelectedIntention(intention);
    }
  };

  const handleApply = () => {
    const updatedFilters: FilterOptions = {
      ...filters,
      interests: selectedInterests,
      relationshipIntention: selectedIntention
    };
    onApplyFilters(updatedFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSelectedInterests([]);
    setSelectedIntention(null);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed top-4 right-4 z-10 rounded-full shadow-sm flex items-center gap-2"
        onClick={toggleFilter}
      >
        <Filter size={18} />
        Filters
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-start overflow-y-auto pt-4 pb-20 px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-md w-full shadow-lg p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={toggleFilter}>
                  <X size={18} />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Age Range Filter */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Age Range</label>
                    <span className="text-xs text-gray-500">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
                  </div>
                  <Slider
                    defaultValue={filters.ageRange}
                    min={18}
                    max={65}
                    step={1}
                    onValueChange={handleAgeRangeChange}
                  />
                </div>
                
                {/* Distance Filter */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Distance</label>
                    <span className="text-xs text-gray-500">Up to {filters.distance} miles</span>
                  </div>
                  <Slider
                    defaultValue={[filters.distance]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={handleDistanceChange}
                  />
                </div>
                
                {/* Verified Only Switch */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Verified Profiles Only</p>
                    <p className="text-xs text-gray-500">Only show profiles that have been verified</p>
                  </div>
                  <Switch
                    checked={filters.showVerifiedOnly}
                    onCheckedChange={toggleVerified}
                  />
                </div>
                
                {/* Interests */}
                <div>
                  <label className="text-sm font-medium block mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <Badge 
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer ${selectedInterests.includes(interest) ? 'bg-amoura-deep-pink hover:bg-amoura-deep-pink/90' : ''}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Relationship Intention */}
                <div>
                  <label className="text-sm font-medium block mb-2">Looking for</label>
                  <div className="grid grid-cols-2 gap-2">
                    {intentions.map(intention => (
                      <Button
                        key={intention}
                        variant={selectedIntention === intention ? "default" : "outline"}
                        className={`w-full ${selectedIntention === intention ? 'bg-amoura-deep-pink hover:bg-amoura-deep-pink/90' : ''}`}
                        onClick={() => selectIntention(intention)}
                      >
                        {intention}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                  <Button 
                    className="flex-1 bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MatchFilters;
