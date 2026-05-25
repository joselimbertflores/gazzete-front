export interface PublicDocumentResponse {
  id: string;
  code: string;
  summary: string;
  legalStatus: string;
  publicationDate: string;
  promulgationDate: string | null;
  validUntil: string | null;
  downloadCount: number;
  typeName: string;
  year: number;
  file: {
    url: string;
    name: string;
    mimeType: string;
    sizeBytes: number;
  };
  incomingRelation: PublicDocumentRelation | null;
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

export interface PublicDocumentRelation {
  relationType: string;
  note: string | null;
  document: {
    id: string;
    code: string;
    summary?: string;
    typeName: string;
  };
}

export interface PublicDocumentRelations {
  outgoing: PublicDocumentRelation[];
  incoming: PublicDocumentRelation | null;
}
