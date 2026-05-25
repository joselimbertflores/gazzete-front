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
  incomingRelation: PublicDocumentRelation | null;
}

export interface DocumentFileResponse {
  url: string;
  name?: string;
  originalName?: string;
  mimeType: string;
  sizeBytes?: string | number;
  size?: string | number;
}
export interface PublicDocumentDetail {
  id: string;
  code: string;
  summary: string;
  validUntil: string | null;
  legalStatus: string;
  downloadCount: number;
  publicationDate: string;
  promulgationDate: string | null;
  typeName: string;
  file: PublicDocumentFile;
  relations: PublicDocumentRelations;
}

interface PublicDocumentFile {
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PublicRelatedDocument {
  id: string;
  code: string;
  summary?: string;
  typeName: string;
}

export interface PublicDocumentRelation {
  relationType: string;
  note: string | null;
  document: PublicRelatedDocument;
}

export interface PublicDocumentRelations {
  outgoing: PublicDocumentRelation[];
  incoming: PublicDocumentRelation | null;
}
