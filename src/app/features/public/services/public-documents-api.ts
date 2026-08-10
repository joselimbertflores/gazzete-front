import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import { of, tap } from 'rxjs';

import {
  DocTypeResponse,
  PublicDocumentDetail,
  PublicDocumentResponse,
  LandingDataResponse,
} from '../types';
import { environment } from '../../../../environments/environment';

export interface GetPublicDocumentsParams {
  term?: string | null;
  type?: string | null;
  year?: number | string | null;
  legalStatus?: string | null;
  limit?: number;
  offset?: number;
}

interface PublicDocumentsData {
  documents: PublicDocumentResponse[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class PublicDocumentsApi {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly URL = `${environment.baseUrl}/api/public-documents`;
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly documentListCache = new Map<string, PublicDocumentsData>();
  private readonly maxDocumentListCacheEntries = 30;

  constructor() {}

  getLandingData() {
    return this.http.get<LandingDataResponse>(`${this.URL}/landing`);
  }

  getTypeOptions() {
    return this.http.get<DocTypeResponse[]>(`${this.URL}/types`);
  }

  getDocumentDetail(slug: string) {
    return this.http.get<PublicDocumentDetail>(`${this.URL}/detail/${slug}`);
  }

  findAll(params: GetPublicDocumentsParams) {
    const httpParams = this.buildHttpParams(params);
    const cacheKey = httpParams.toString();

    if (this.isBrowser) {
      const cached = this.documentListCache.get(cacheKey);

      if (cached) {
        return of(cached);
      }
    }

    return this.http
      .get<PublicDocumentsData>(this.URL, {
        params: httpParams,
      })
      .pipe(
        tap((data) => {
          if (!this.isBrowser) return;

          this.documentListCache.set(cacheKey, data);
          this.pruneDocumentListCache();
        }),
      );
  }

  private buildHttpParams(params: GetPublicDocumentsParams): HttpParams {
    const cleanParams = Object.fromEntries(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .sort(([a], [b]) => a.localeCompare(b)),
    );
    return new HttpParams({ fromObject: cleanParams });
  }

  private pruneDocumentListCache(): void {
    if (this.documentListCache.size <= this.maxDocumentListCacheEntries) return;

    const oldestKey = this.documentListCache.keys().next().value;

    if (oldestKey) {
      this.documentListCache.delete(oldestKey);
    }
  }
}
