export interface PublicDocumentResponse {
  id: string;
  code: string;
  summary: string;
  legalStatus: string;
  publicationDate: string;
  promulgationDate: string;
  validUntil: string | null;
  type: string;
  url: string;
}
