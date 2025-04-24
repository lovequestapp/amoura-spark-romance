
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

interface OnboardingPhoto {
  file: File;
  url: string;
}

export interface ProfilePrompt {
  question: string;
  answer: string;
  category?: string;
}

export const uploadPhotos = async (photos: OnboardingPhoto[]): Promise<string[]> => {
  try {
    const uploadedUrls: string[] = [];
    
    for (const photo of photos) {
      const fileExt = photo.file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, photo.file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);
        
      uploadedUrls.push(data.publicUrl);
    }
    
    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading photos:', error);
    throw error;
  }
};

export const updateProfile = async (data: {
  photos?: string[];
  birth_date?: string;
  gender?: 'woman' | 'man' | 'nonbinary' | 'other';
  pronouns?: string;
  height?: number;
  drinking?: string;
  education?: string;
  relationship_type?: string;
  onboarding_step?: number;
  onboarding_completed?: boolean;
  prompts?: ProfilePrompt[];
}) => {
  try {
    // Get user first before updating
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');
    
    // Convert ProfilePrompt[] to Json[] for storage if present
    const updateData = { ...data };
    if (updateData.prompts) {
      // Type assertion to convert ProfilePrompt[] to Json[]
      updateData.prompts = updateData.prompts as unknown as Json[];
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const saveInterests = async (interestIds: string[]) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // First, delete existing interests
    await supabase
      .from('user_interests')
      .delete()
      .eq('user_id', user.id);

    // Then insert new ones
    const { error } = await supabase
      .from('user_interests')
      .insert(
        interestIds.map(interest_id => ({
          user_id: user.id,
          interest_id
        }))
      );

    if (error) throw error;
  } catch (error) {
    console.error('Error saving interests:', error);
    throw error;
  }
};

export const fetchInterests = async () => {
  try {
    const { data, error } = await supabase
      .from('interests')
      .select('*')
      .order('category');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching interests:', error);
    throw error;
  }
};
