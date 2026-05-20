export interface PublicLandingResponse {
  documentTypes: PublicDocumentTypeItem[];
  recentDocuments: PublicDocumentCard[];
  featuredDocuments: PublicDocumentCard[];
  stats: PublicLandingStats;
}

export interface PublicDocumentTypeItem {
  id: string;
  name: string;
  description?: string | null;
  documentsCount: number;
}

export interface PublicDocumentCard {
  id: string;
  code: string;
  summary: string;
  typeName: string;
  year: number;
  publicationDate: string;
  legalStatus: string;
}

export interface PublicLandingStats {
  totalPublishedDocuments: number;
  documentTypesCount: number;
  currentYearPublications: number;
  currentYear: number;
  availableYears: AvailableYearsRange;
}

export interface AvailableYearsRange {
  min: number | null;
  max: number | null;
}
