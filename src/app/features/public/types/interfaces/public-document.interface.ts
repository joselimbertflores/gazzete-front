export interface PublicDocumentResponse {
  id: string;
  code: string;
  summary: string;
  legalStatus: string;
  publicationDate: string;
  promulgationDate: string;
  validUntil: string | null;
  downloadCount: number;
  type: string;
  year?: number | string;
  file: DocumentFileResponse;
}

export interface DocumentFileResponse {
  url: string;
  name?: string;
  originalName?: string;
  mimeType: string;
  sizeBytes?: string | number;
  size?: string | number;
}
