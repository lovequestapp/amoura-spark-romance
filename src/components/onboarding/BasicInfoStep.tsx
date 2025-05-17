
import React from 'react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useError } from '@/contexts/ErrorContext';

interface BasicInfoStepProps {
  formData: {
    name: string;
    age: number;
    gender: string;
    location: string;
    occupation: string;
    education: string;
    relationshipType: string;
    bio: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const relationshipOptions = [
  "Long-term relationship",
  "Short-term relationship",
  "Casual dating",
  "Marriage",
  "Not sure yet"
];

const genderOptions = [
  "Man",
  "Woman",
  "Non-binary",
  "Other",
  "Prefer not to say"
];

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50, { message: "Name cannot exceed 50 characters" }),
  age: z.coerce.number().min(18, { message: "You must be at least 18 years old" }).max(120, { message: "Please enter a valid age" }),
  gender: z.string().min(1, { message: "Please select your gender" }),
  location: z.string().min(2, { message: "Location is required" }),
  occupation: z.string().optional(),
  education: z.string().optional(),
  relationshipType: z.string().min(1, { message: "Please select what you're looking for" }),
  bio: z.string().max(500, { message: "Bio cannot exceed 500 characters" }).optional()
});

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, setFormData }) => {
  const { handleError } = useError();
  
  // Define form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name || "",
      age: formData.age || 18,
      gender: formData.gender || "",
      location: formData.location || "",
      occupation: formData.occupation || "",
      education: formData.education || "",
      relationshipType: formData.relationshipType || "",
      bio: formData.bio || ""
    },
  });
  
  // Update parent component's state when form values change
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        setFormData(current => ({
          ...current,
          ...value
        }));
      } catch (error) {
        handleError(error, "Error updating form data");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch, setFormData, handleError]);
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about yourself</h2>
      <p className="text-gray-500 mb-8">Let others know who you are</p>
      
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" min={18} max={120} {...field} />
                </FormControl>
                <FormDescription>You must be at least 18 years old to use this platform.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Your occupation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Input placeholder="Your education" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="relationshipType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you looking for?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select what you're looking for" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {relationshipOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell others about yourself" 
                    className="min-h-[100px]" 
                    {...field} 
                    maxLength={500}
                  />
                </FormControl>
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${field.value.length > 400 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {field.value.length || 0}/500
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default BasicInfoStep;
