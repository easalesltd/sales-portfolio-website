import { Metadata } from 'next';

export interface CompanyMetadata extends Metadata {
  title: string;
  description: string;
  keywords: string;
  structuredData?: any; // For JSON-LD data
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  logoUrlDark?: string;
  catalogueUrl: string;
  websiteUrl: string;
  videos?: string[]; // Array of video URLs for Trade Show Videos
  brandLogos?: string[]; // Array of brand logo URLs
  metadata?: CompanyMetadata; // Make metadata optional since it's not in the original data
} 