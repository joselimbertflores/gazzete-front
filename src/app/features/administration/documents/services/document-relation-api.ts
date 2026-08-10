import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import {
  DocumentRelationResponse,
  DocumentRelationType,
  DocumentSearchOptionResponse,
} from '../interfaces';

interface SaveDocRelationDto {
  sourceDocumentId: string;
  type: DocumentRelationType;
  note?: string | null;
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

  save(targetDocumentId: string, { sourceDocumentId, type, note }: SaveDocRelationDto) {
    return this.http.put<{ message: string; targetLegalStatus: string }>(
      `${this.URL}/${targetDocumentId}`,
      {
        sourceDocumentId,
        type,
        note: note || null,
      },
    );
  }

  findByTarget(targetId: string) {
    return this.http.get<DocumentRelationResponse | null>(`${this.URL}/${targetId}`);
  }

  remove(targetId: string) {
    return this.http.delete<{ message: string; targetLegalStatus: string }>(
      `${this.URL}/${targetId}`,
    );
  }
}
