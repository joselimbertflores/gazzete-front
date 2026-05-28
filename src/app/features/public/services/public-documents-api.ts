import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import { of, shareReplay, tap } from 'rxjs';

import { PublicDocumentDetail, PublicDocumentResponse, LandingDataResponse } from '../types';
import { environment } from '../../../../environments/environment';

export interface GetPublicDocumentsParams {
  term?: string | null;
  type?: number | string | null;
  year?: number | string | null;
  legalStatus?: string | null;
  limit?: number;
  offset?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PublicDocumentsApi {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly URL = `${environment.baseUrl}/api/public-documents`;
  private isBrowser = isPlatformBrowser(this.platformId);

  documentListCache: Record<string, { documents: PublicDocumentResponse[]; total: number }> = {};

  constructor() {}

  getLandingData() {
    return this.http.get<LandingDataResponse>(`${this.URL}/landing`);
  }

  getTypeOptions() {
    return this.http
      .get<{ id: number; name: string }[]>(`${this.URL}/types`)
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  }

  getDocumentDetail(id: string) {
    return this.http.get<PublicDocumentDetail>(`${this.URL}/detail/${id}`);
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

    if (this.isBrowser) {
      const cached = this.documentListCache[key];
      if (cached) return of(cached);
    }

    return this.http
      .get<{ documents: PublicDocumentResponse[]; total: number }>(`${this.URL}`, {
        params: new HttpParams({ fromObject: cleanParams }),
      })
      .pipe(
        tap((data) => {
          if (this.isBrowser) {
            this.documentListCache[key] = data;
          }
        }),
      );
  }
}
