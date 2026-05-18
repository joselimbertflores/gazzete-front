export enum DocumentLegalStatus {
  VALID = 'VALID',
  MODIFIED = 'MODIFIED',
  ABROGATED = 'ABROGATED',
  DEROGATED = 'DEROGATED',
}

export enum DocumentRelationType {
  MODIFIES = 'MODIFIES',
  ABROGATES = 'ABROGATES',
  DEROGATES = 'DEROGATES',
}

export interface DocumentResponse {
  id: string;
  title: string;
  summary: string;
  type: {
    id: number;
    name: string;
  };
  typeId: number;
  correlativeNumber: number;
  year: number;
  numberingScope: string;
  status: string;
  legalStatus: string;
  promulgationDate: string | null;
  publicationDate: string;
  validUntil: string | null;
  createdAt: string;
  updatedAt: string;
  code: string;
  file: DocumentFile;
}

export interface DocumentFile {
  url: string;
  name: string;
  size: string;
}

export interface DocumentDetailResponse {
  id: string;
  summary: string;
  typeId: number;
  correlativeNumber: number;
  suffix: null;
  year: number;
  code: string;
  numberingScope: string;
  status: string;
  legalStatus: string;
  downloadCount: number;
  publicationDate: string;
  promulgationDate: null;
  validUntil: null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  fileId: string;
  file: DocumentDetailFile;
  type: string;
  incomingRelation: IncomingDocumentRelation | null;
  outgoingRelations: OutgoingDocumentRelation[];
}
interface DocumentDetailFile {
  url: string;
  size: number;
  originalName: string;
  mimeType: string;
}

interface IncomingDocumentRelation {
  id: string;
  type: DocumentRelationType;
  note: string | null;
  sourceDocument: RelatedDocument;
}

interface OutgoingDocumentRelation {
  id: string;
  type: DocumentRelationType;
  note: string | null;
  targetDocument: RelatedDocument;
}

interface RelatedDocument {
  id: string;
  code: string;
  typeName: string;
  summary: string;
}
