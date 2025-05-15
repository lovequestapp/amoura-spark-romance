
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface BasicInfoStepProps {
  formData: {
    fullName: string;
    birthDate: string;
    gender: string;
    pronouns: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, setFormData }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const validateDate = (date: string): boolean => {
    if (!date) return false;
    
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    // Check if birthday hasn't occurred yet this year
    const hasBirthdayOccurred = 
      today.getMonth() > birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    
    const adjustedAge = hasBirthdayOccurred ? age : age - 1;
    
    return adjustedAge >= 18;
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
      
      <div className="space-y-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">First Name</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Your first name"
            className="w-full p-4 rounded-xl border border-gray-200"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthDate">Birthday</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => {
              handleInputChange(e);
              if (!validateDate(e.target.value)) {
                toast({
                  title: "Age Restriction",
                  description: "You must be at least 18 years old to use this app",
                  variant: "destructive",
                });
              }
            }}
            className="w-full p-4 rounded-xl border border-gray-200"
            required
          />
          <p className="text-xs text-gray-500">You must be at least 18 years old</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange('gender', value)}
          >
            <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="woman">Woman</SelectItem>
              <SelectItem value="man">Man</SelectItem>
              <SelectItem value="nonbinary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronouns</Label>
          <Select
            value={formData.pronouns}
            onValueChange={(value) => handleSelectChange('pronouns', value)}
          >
            <SelectTrigger className="w-full p-4 rounded-xl border border-gray-200">
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="she/her">She/Her</SelectItem>
              <SelectItem value="he/him">He/Him</SelectItem>
              <SelectItem value="they/them">They/Them</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
