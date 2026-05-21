import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, of, tap } from 'rxjs';

import { PublicDocumentResponse, PublicLandingResponse } from '../types';
import { environment } from '../../../../environments/environment';

export interface GetPublicDocumentsParams {
  term?: string | null;
  type?: number | string | null;
  year?: number | string | null;
  legalStatus?: string | null;
  sort?: string | null;
  limit?: number;
  offset?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PublicDocumentsApi {
  private readonly URL = `${environment.baseUrl}/api/public-documents`;

  private http = inject(HttpClient);

  documentListCache: Record<string, { documents: PublicDocumentResponse[]; total: number }> = {};
  documentCache: Record<string, PublicDocumentResponse> = {};

  docTypes = toSignal(
    this.http
      .get<{ id: number; name: string }[]>(`${this.URL}/types`)
      .pipe(map((types) => types.map((t) => ({ value: t.id.toString(), label: t.name })))),
    { initialValue: [] },
  );

  docTypesResource = rxResource({
    stream: () => this.http.get<{ id: number; name: string }[]>(`${this.URL}/types`),
  });

  recentDocsResource = rxResource({
    stream: () => this.http.get<PublicDocumentResponse[]>(`${this.URL}/recent`),
  });

  recentDocuments = toSignal(this.http.get<PublicDocumentResponse[]>(`${this.URL}/recent`), {
    initialValue: [],
  });

  constructor() {}

  getLandingData() {
    return this.http.get<PublicLandingResponse>(`${this.URL}/landing`).pipe();
  }

  findAll(params: GetPublicDocumentsParams) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    const sortedParams = Object.keys(cleanParams)
      .sort()
      .reduce(
        (acc, key) => {
          acc[key as keyof typeof cleanParams] = cleanParams[key];
          return acc;
        },
        {} as typeof cleanParams,
      );

    const httpParams = new HttpParams({ fromObject: sortedParams });
    const key = httpParams.toString();

    const cached = this.documentListCache[key];
    if (cached) return of(cached);

    return this.http
      .get<{ documents: PublicDocumentResponse[]; total: number }>(`${this.URL}`, {
        params: new HttpParams({ fromObject: cleanParams }),
      })
      .pipe(tap((data) => (this.documentListCache[key] = data)));
  }

  findOne(id: string) {
    const cached = this.documentCache[id];
    if (cached) return of(cached);
    return this.http
      .get<any>(`${this.URL}/${id}`)
      .pipe(tap((doc) => (this.documentCache[id] = doc)));
  }
}
