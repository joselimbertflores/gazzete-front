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
export interface PublicDocumentDetailResp {
  id: string;
  code: string;
  summary: string;
  validUntil: string | null;
  legalStatus: string;
  downloadCount: number;
  publicationDate: string;
  promulgationDate: string | null;
  year?: number | string | null;
  typeName: string;
  file: PublicDocumentDetailFile;
  relations: Relations;
}

interface PublicDocumentDetailFile {
  url: string;
  downloadUrl?: string | null;
  mimeType?: string | null;
  sizeBytes?: string | number | null;
}

export interface PublicDocumentRelationDocument {
  id: string;
  code: string;
  typeName: string;
  legalStatus?: string | null;
}

export interface PublicDocumentRelation {
  relationType: string;
  note?: string | null;
  document: PublicDocumentRelationDocument;
}

interface Relations {
  outgoing: PublicDocumentRelation[];
  incoming: PublicDocumentRelation | PublicDocumentRelation[] | null;
}
