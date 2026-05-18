import { DocumentRelationType } from './document-response.interface';

export interface DocumentRelationResponse {
  id: string;
  type: DocumentRelationType;
  note: string | null;
  sourceDocument: SourceDocumentResponse;
}

export interface SourceDocumentResponse {
  id: string;
  code: string;
  typeName: string;
  summary: string;
}

export interface DocumentSearchOptionResponse {
  id: string;
  code: string;
  summary: string;
  typeName: string;
}
