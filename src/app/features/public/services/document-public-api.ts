import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { map, of, tap } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { PublicDocumentResponse } from '../types';

export interface GetPublicDocumentsParams {
  term?: string | null;
  type?: number | null;
  year?: number | null;
  legalStatus?: string | null;
  limit?: number;
  offset?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentPublicApi {
  private readonly URL = `${environment.baseUrl}/documents-public`;

  private http = inject(HttpClient);

  documentListCache: Record<string, { documents: any[]; total: number }> = {};
  documentCache: Record<string, any> = {};

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
      .get<{ documents: any[]; total: number }>(`${this.URL}`, {
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
