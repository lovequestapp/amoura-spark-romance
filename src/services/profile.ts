
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import type { Json } from "@/integrations/supabase/types";

export interface ProfilePrompt {
  question: string;
  answer: string;
  category?: string;
}

export const uploadProfilePhoto = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
};

export const updateProfilePhotos = async (photos: string[]): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('profiles')
      .update({ photos })
      .eq('id', user.data.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating profile photos:', error);
    return false;
  }
};

export const updateProfileBio = async (bio: string): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('profiles')
      .update({ bio })
      .eq('id', user.data.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating bio:', error);
    return false;
  }
};

export const fetchPrompts = async (): Promise<{ id: string; question: string; category: string }[]> => {
  const { data, error } = await supabase
    .from('profile_prompts')
    .select('*')
    .order('category');

  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }

  return data;
};

export const updateProfilePrompts = async (prompts: ProfilePrompt[]): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) throw new Error("User not authenticated");

    // Convert ProfilePrompt[] to Json[] for storage
    const jsonPrompts = prompts as unknown as Json[];

    const { error } = await supabase
      .from('profiles')
      .update({ prompts: jsonPrompts })
      .eq('id', user.data.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating prompts:', error);
    return false;
  }
};
