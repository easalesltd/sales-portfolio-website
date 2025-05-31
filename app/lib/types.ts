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
  catalogueUrl: string;
  websiteUrl: string;
  metadata?: CompanyMetadata; // Make metadata optional since it's not in the original data
} 