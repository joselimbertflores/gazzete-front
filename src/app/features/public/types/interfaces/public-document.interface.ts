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
  file: DocumentFileResponse;
}

export interface DocumentFileResponse {
  url: string;
  name: string;
  mimeType: string;
  sizeBytes: string;
}
