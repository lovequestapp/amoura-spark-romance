
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import type { Json } from "@/integrations/supabase/types";

export interface ProfilePrompt {
  question: string;
  answer: string;
  category?: string;
}

export interface UploadResult {
  url: string | null;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export const validatePhoto = (file: File): string | null => {
  if (!file) return "No file selected";
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Invalid file type. Please upload JPEG, PNG, WEBP, HEIC, or HEIF images.";
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
  }
  
  return null;
};

export const uploadProfilePhoto = async (file: File): Promise<UploadResult> => {
  try {
    const validationError = validatePhoto(file);
    if (validationError) {
      console.error('Photo validation failed:', validationError);
      return { url: null, error: validationError };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError.message);
      throw new Error(uploadError.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return { url: publicUrl };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return { 
      url: null, 
      error: error instanceof Error ? error.message : "Unknown upload error occurred" 
    };
  }
};

export const updateProfilePhotos = async (photos: string[]): Promise<{success: boolean; error?: string}> => {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication error: " + authError.message);
    if (!userData.user) throw new Error("User not authenticated");
    
    console.log("Updating profile photos:", photos);

    const { error } = await supabase
      .from('profiles')
      .update({ photos })
      .eq('id', userData.user.id);

    if (error) throw new Error("Database error: " + error.message);
    return { success: true };
  } catch (error) {
    console.error('Error updating profile photos:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update profile photos" 
    };
  }
};

export const updateProfileBio = async (bio: string): Promise<{success: boolean; error?: string}> => {
  try {
    if (bio.length > 500) {
      return { success: false, error: "Bio cannot exceed 500 characters" };
    }
    
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication error: " + authError.message);
    if (!userData.user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from('profiles')
      .update({ bio })
      .eq('id', userData.user.id);

    if (error) throw new Error("Database error: " + error.message);
    return { success: true };
  } catch (error) {
    console.error('Error updating bio:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update profile bio" 
    };
  }
};

export const validatePrompt = (prompt: ProfilePrompt): string | null => {
  if (!prompt.question || prompt.question.trim() === '') {
    return "Question is required";
  }
  
  if (!prompt.answer || prompt.answer.trim() === '') {
    return "Answer is required";
  }
  
  if (prompt.answer.length > 300) {
    return "Answer cannot exceed 300 characters";
  }
  
  return null;
};

export const updateProfilePrompts = async (prompts: ProfilePrompt[]): Promise<{success: boolean; error?: string}> => {
  try {
    // Validate all prompts
    for (const prompt of prompts) {
      const error = validatePrompt(prompt);
      if (error) {
        return { success: false, error };
      }
    }
    
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw new Error("Authentication error: " + authError.message);
    if (!userData.user) throw new Error("User not authenticated");

    // Convert ProfilePrompt[] to Json[] for storage
    const jsonPrompts = prompts as unknown as Json[];

    const { error } = await supabase
      .from('profiles')
      .update({ prompts: jsonPrompts })
      .eq('id', userData.user.id);

    if (error) throw new Error("Database error: " + error.message);
    return { success: true };
  } catch (error) {
    console.error('Error updating prompts:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update profile prompts" 
    };
  }
};

export const fetchProfileData = async (): Promise<{
  photos: string[];
  bio: string;
  prompts: ProfilePrompt[];
  error?: string;
}> => {
  try {
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication error: " + authError.message);
    if (!userData.user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('profiles')
      .select('photos, bio, prompts')
      .eq('id', userData.user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Profile not found, return empty data
        return {
          photos: [],
          bio: "",
          prompts: []
        };
      }
      throw new Error("Database error: " + error.message);
    }
    
    // Convert the Json[] to ProfilePrompt[] safely
    const typedPrompts: ProfilePrompt[] = (data?.prompts as Json[] || [])
      .map(prompt => {
        if (typeof prompt === 'object' && prompt !== null) {
          const promptObj = prompt as Record<string, unknown>;
          return {
            question: promptObj.question ? String(promptObj.question) : '',
            answer: promptObj.answer ? String(promptObj.answer) : '',
            category: promptObj.category ? String(promptObj.category) : undefined
          };
        }
        return { question: '', answer: '' };
      })
      .filter(prompt => prompt.question && prompt.answer);
    
    return {
      photos: data?.photos || [],
      bio: data?.bio || "",
      prompts: typedPrompts
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return {
      photos: [],
      bio: "",
      prompts: [],
      error: error instanceof Error ? error.message : "Failed to fetch profile data"
    };
  }
};
