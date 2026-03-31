import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

export interface GetPublicDocumentsParams {
  term?: string | null;
  type?: number | null;
  year?: number | null;
  legalStatus?: string | null;
  limit?: number | null;
  offset?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentPublicApi {
  private readonly URL = `${environment.baseUrl}/documents-public`;

  private http = inject(HttpClient);

  constructor() {}

  findAll(params: GetPublicDocumentsParams) {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    return this.http.get<{ documents: any[]; total: number }>(`${this.URL}`, {
      params: new HttpParams({
        fromObject: cleanParams,
      }),
    });
  }
}
