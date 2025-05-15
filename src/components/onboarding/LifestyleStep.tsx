
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LifestyleStepProps {
  formData: {
    height: string;
    drinking: string;
    education: string;
    relationshipType: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ formData, setFormData }) => {
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifestyle questions</h2>
      <p className="text-gray-500 mb-8">Help potential matches get to know you better</p>
      
      <div className="space-y-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="relationshipType">Relationship type</Label>
          <Select
            value={formData.relationshipType}
            onValueChange={(value) => handleSelectChange('relationshipType', value)}
          >
            <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
              <SelectValue placeholder="What are you looking for?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="longterm">Long-term relationship</SelectItem>
              <SelectItem value="shortterm">Short-term relationship</SelectItem>
              <SelectItem value="casual">Casual dating</SelectItem>
              <SelectItem value="friends">New friends</SelectItem>
              <SelectItem value="stillFiguring">Still figuring it out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Select
            value={formData.education}
            onValueChange={(value) => handleSelectChange('education', value)}
          >
            <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
              <SelectValue placeholder="Your highest level of education" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highschool">High School</SelectItem>
              <SelectItem value="associate">Associate degree</SelectItem>
              <SelectItem value="bachelor">Bachelor's degree</SelectItem>
              <SelectItem value="master">Master's degree</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="drinking">Drinking</Label>
          <Select
            value={formData.drinking}
            onValueChange={(value) => handleSelectChange('drinking', value)}
          >
            <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
              <SelectValue placeholder="How often do you drink?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="socially">Socially</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Select
            value={formData.height}
            onValueChange={(value) => handleSelectChange('height', value)}
          >
            <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
              <SelectValue placeholder="Your height" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 36 }).map((_, i) => {
                const feet = Math.floor((i + 48) / 12);
                const inches = (i + 48) % 12;
                return (
                  <SelectItem key={i} value={`${i + 48}`}>
                    {feet}'{inches}"
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;
