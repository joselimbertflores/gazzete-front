import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { map, of, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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

  cache: Record<string, { documents: any[]; total: number }> = {};

  docTypes = toSignal(
    this.http
      .get<{ id: number; name: string }[]>(`${this.URL}/types`)
      .pipe(map((types) => types.map((t) => ({ value: t.id.toString(), label: t.name })))),
  );

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

    const cached = this.cache[key];
    // if (cached) return of(cached);

    return this.http
      .get<{ documents: any[]; total: number }>(`${this.URL}`, {
        params: new HttpParams({ fromObject: cleanParams }),
      })
      .pipe(tap((data) => (this.cache[key] = data)));
  }

  findOne(id: string) {
    return this.http.get<any>(`${this.URL}/${id}`);
  }
}
