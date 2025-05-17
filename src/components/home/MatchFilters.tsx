
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Sparkles, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  ageRange: [number, number];
  distance: number;
  showVerifiedOnly: boolean;
  interests: string[];
  relationshipIntention: string | null;
  personalityPriorities?: {
    creative?: number;
    analytical?: number;
    adventurous?: number;
    social?: number;
  };
  matchAlgorithm?: 'balanced' | 'personality' | 'interests' | 'location';
}

const defaultFilters: FilterOptions = {
  ageRange: [21, 35],
  distance: 25,
  showVerifiedOnly: false,
  interests: [],
  relationshipIntention: null,
  personalityPriorities: {
    creative: 25,
    analytical: 25,
    adventurous: 25,
    social: 25
  },
  matchAlgorithm: 'balanced'
};

const interests = ["Travel", "Music", "Fitness", "Food", "Art", "Movies", "Reading", "Gaming", "Outdoors", "Photography"];
const intentions = ["Casual", "Dating", "Relationship", "Marriage"];
const algorithmOptions = [
  { value: 'balanced', label: 'Balanced', description: 'Equal weight to all factors' },
  { value: 'personality', label: 'Personality First', description: 'Prioritize personality compatibility' },
  { value: 'interests', label: 'Common Interests', description: 'Find people with similar interests' },
  { value: 'location', label: 'Nearby', description: 'Prioritize people closer to you' }
];

const MatchFilters: React.FC<MatchFiltersProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);
  const [dbInterests, setDbInterests] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('balanced');

  // Fetch interests from database
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const { data, error } = await supabase
          .from('interests')
          .select('name')
          .order('name');
          
        if (error) throw error;
        
        if (data && data.length) {
          setDbInterests(data.map(i => i.name));
        }
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };
    
    fetchInterests();
  }, []);

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
  
  const handleAlgorithmChange = (value: string) => {
    setSelectedAlgorithm(value);
  };
  
  const handlePersonalityPriorityChange = (trait: string, values: number[]) => {
    setFilters(prev => ({
      ...prev,
      personalityPriorities: {
        ...prev.personalityPriorities,
        [trait]: values[0]
      }
    }));
  };

  const handleApply = () => {
    const updatedFilters: FilterOptions = {
      ...filters,
      interests: selectedInterests,
      relationshipIntention: selectedIntention,
      matchAlgorithm: selectedAlgorithm as 'balanced' | 'personality' | 'interests' | 'location'
    };
    onApplyFilters(updatedFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSelectedInterests([]);
    setSelectedIntention(null);
    setSelectedAlgorithm('balanced');
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
              
              <div className="flex border-b mb-4">
                <button
                  className={`flex-1 py-2 text-center font-medium ${activeTab === 'basic' ? 'border-b-2 border-amoura-deep-pink text-amoura-deep-pink' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('basic')}
                >
                  Basic Filters
                </button>
                <button
                  className={`flex-1 py-2 text-center font-medium ${activeTab === 'advanced' ? 'border-b-2 border-amoura-deep-pink text-amoura-deep-pink' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('advanced')}
                >
                  Advanced Matching
                </button>
              </div>
              
              {activeTab === 'basic' ? (
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
                      {(dbInterests.length > 0 ? dbInterests : interests).map(interest => (
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
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Match Algorithm Selector */}
                  <div>
                    <label className="text-sm font-medium block mb-2">Matching Algorithm</label>
                    <Select 
                      value={selectedAlgorithm} 
                      onValueChange={handleAlgorithmChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select matching algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        {algorithmOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center">
                              <Sparkles size={16} className="mr-2 text-amoura-deep-pink" />
                              <div>
                                <p>{option.label}</p>
                                <p className="text-xs text-gray-500">{option.description}</p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Personality Trait Priorities */}
                  <div>
                    <div className="flex items-center mb-2">
                      <HeartHandshake size={18} className="mr-2 text-amoura-deep-pink" />
                      <label className="text-sm font-medium">Personality Trait Importance</label>
                    </div>
                    
                    <div className="space-y-4 mt-3">
                      {/* Creative */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Creative</span>
                          <span className="text-xs text-gray-500">
                            {filters.personalityPriorities?.creative || 25}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[filters.personalityPriorities?.creative || 25]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(values) => handlePersonalityPriorityChange('creative', values)}
                        />
                      </div>
                      
                      {/* Analytical */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Analytical</span>
                          <span className="text-xs text-gray-500">
                            {filters.personalityPriorities?.analytical || 25}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[filters.personalityPriorities?.analytical || 25]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(values) => handlePersonalityPriorityChange('analytical', values)}
                        />
                      </div>
                      
                      {/* Adventurous */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Adventurous</span>
                          <span className="text-xs text-gray-500">
                            {filters.personalityPriorities?.adventurous || 25}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[filters.personalityPriorities?.adventurous || 25]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(values) => handlePersonalityPriorityChange('adventurous', values)}
                        />
                      </div>
                      
                      {/* Social */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Social</span>
                          <span className="text-xs text-gray-500">
                            {filters.personalityPriorities?.social || 25}%
                          </span>
                        </div>
                        <Slider
                          defaultValue={[filters.personalityPriorities?.social || 25]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(values) => handlePersonalityPriorityChange('social', values)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-6">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MatchFilters;
