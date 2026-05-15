import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { DocumentSearchOptionResponse } from '../interfaces';

interface CreateDocRelationDto {
  targetDocumentId: string;
  sourceDocumentId: string;
  type: string;
  note?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentRelationApi {
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/api/document-relations`;

  findCandidates(term: string, excludeDocumentId?: string) {
    return this.http.get<DocumentSearchOptionResponse[]>(`${this.URL}/candidates`, {
      params: new HttpParams({
        fromObject: { term, ...(excludeDocumentId && { excludeDocumentId }) },
      }),
    });
  }

  create({ targetDocumentId, sourceDocumentId, type, note }: CreateDocRelationDto) {
    return this.http.put(`${this.URL}/${targetDocumentId}`, {
      sourceDocumentId,
      type,
      note,
    });
  }

  findByTarget(documentId: string) {
    return this.http.get<any>(`${this.URL}/${documentId}`);
  }

  remove(targetId: string) {
    return this.http.delete(`${this.URL}/${targetId}`);
  }
}
