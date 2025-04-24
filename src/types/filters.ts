
export interface FilterOptions {
  ageRange: [number, number];
  distance: number;
  showVerifiedOnly: boolean;
  interests: string[];
  relationshipIntention: string | null;
}
