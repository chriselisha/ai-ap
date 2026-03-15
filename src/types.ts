export type PropertyType = 'Apartment' | 'Villa' | 'House' | 'Studio' | 'Office' | 'Townhouse' | 'Penthouse' | 'Land' | 'Commercial';
export type ListingPurpose = 'Sale' | 'Rent';

export interface GenerateListingInput {
  country: string;
  state: string;
  area: string;
  propertyType: PropertyType;
  purpose: ListingPurpose;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string;
  notes: string;
  images: string[];
}

export interface GenerateListingOutput {
  title: string;
  description: string;
  instagramCaption: string;
  hashtags: string[];
  estimatedSalePrice: string;
  estimatedMonthlyRent: string;
  detectedMarket: string;
  currency: string;
  confidenceScore: number;
}

export interface OptimizeListingInput {
  url: string;
  platform: 'Zillow' | 'Airbnb' | 'Other';
  notes: string;
}

export interface OptimizeListingOutput {
  originalTitle: string;
  originalDescription: string;
  detectedImage?: string;
  improvedTitle: string;
  improvedDescription: string;
  pricingSuggestion: string;
  seoKeywords: string[];
  listingScore: number;
  suggestedImprovements: string[];
}
