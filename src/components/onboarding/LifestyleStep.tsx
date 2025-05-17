
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
  formData: any;
  setFormData: (data: any) => void;
}

const LifestyleStep: React.FC<LifestyleStepProps> = ({ formData, setFormData }) => {
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lifestyle preferences</h2>
      <p className="text-gray-500 mb-8">Tell others about your lifestyle</p>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Select
            value={formData.height?.toString() || ""}
            onValueChange={(value) => handleChange('height', value)}
          >
            <SelectTrigger id="height">
              <SelectValue placeholder="Select your height" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => i + 150).map((cm) => (
                <SelectItem key={cm} value={cm.toString()}>
                  {cm} cm ({Math.floor(cm/30.48)}'
                  {Math.round((cm/2.54) % 12)}")
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="religion">Religion</Label>
          <Select
            value={formData.religion || ""}
            onValueChange={(value) => handleChange('religion', value)}
          >
            <SelectTrigger id="religion">
              <SelectValue placeholder="Select your religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agnostic">Agnostic</SelectItem>
              <SelectItem value="atheist">Atheist</SelectItem>
              <SelectItem value="buddhist">Buddhist</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="jewish">Jewish</SelectItem>
              <SelectItem value="muslim">Muslim</SelectItem>
              <SelectItem value="sikh">Sikh</SelectItem>
              <SelectItem value="spiritual">Spiritual</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="drinking">Drinking</Label>
          <Select
            value={formData.drinking || ""}
            onValueChange={(value) => handleChange('drinking', value)}
          >
            <SelectTrigger id="drinking">
              <SelectValue placeholder="Select your drinking habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="rarely">Rarely</SelectItem>
              <SelectItem value="socially">Socially</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="smoking">Smoking</Label>
          <Select
            value={formData.smoking || ""}
            onValueChange={(value) => handleChange('smoking', value)}
          >
            <SelectTrigger id="smoking">
              <SelectValue placeholder="Select your smoking habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="occasionally">Occasionally</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="exercise">Exercise</Label>
          <Select
            value={formData.exercise || ""}
            onValueChange={(value) => handleChange('exercise', value)}
          >
            <SelectTrigger id="exercise">
              <SelectValue placeholder="Select your exercise habits" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="sometimes">Sometimes</SelectItem>
              <SelectItem value="regularly">Regularly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default LifestyleStep;
