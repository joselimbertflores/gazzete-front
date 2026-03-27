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
  promulgationDate: string;
  publicationDate: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  file: File;
}

export interface DocumentFile {
  url: string;
  name: string;
  size: string;
}
