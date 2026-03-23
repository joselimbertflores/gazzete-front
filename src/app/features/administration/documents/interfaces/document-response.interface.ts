export interface DocumentResponse {
  id: string;
  title: string;
  summary: string;
  type: DocumentType;
  typeId: number;
  correlativeNumber: number;
  year: number;
  numberingScope: string;
  status: string;
  legalStatus: string;
  promulgationDate: string;
  publicationDate: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  outgoingRelations: OutgoingRelation[];
  code: string;
  file: File;
}

export interface File {
  url: string;
  name: string;
  size: string;
}

export interface OutgoingRelation {
  id: number;
  sourceDocumentId: string;
  targetDocumentId: string;
  relationType: string;
  description: null;
  createdAt: Date;
}

export interface DocumentType {
  id: number;
  name: string;
  numberingMode: string;
  isActive: boolean;
}

export interface RelationCandidateResponseDto {
  id: string;
  title: string;
  correlativeNumber: number;
  year: number;
  code: string;
  publicationDate: Date;
  legalStatus: string;
  type: DocumentType;
}

export interface DocumentType {
  name: string;
}
