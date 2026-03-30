import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DocumentResponse } from '../interfaces';
export interface UploadResult {
  id: string;
  name: string;
}

interface DocumentDto {
  title: string;
  year: string;
  typeId: string;
  summary?: string;
  correlativeNumber: number;
  publicationDate: Date;
  promulgationDate: Date;
  validUntil?: Date;
}

interface GetDocumentsParams {
  limit: number;
  offset: number;
  term?: string;
  typeId?: string;
  year?: string;
  legalStatus?: string;
}
@Injectable({
  providedIn: 'root',
})
export class DocumentAdminApi {
  private readonly URL = `${environment.baseUrl}/documents`;

  private http = inject(HttpClient);

  documentTypes = toSignal(this.http.get<any[]>(`${this.URL}/types`), {
    initialValue: [],
  });

  constructor() {}

  findAll({ limit, offset, term, ...rest }: GetDocumentsParams) {
    return this.http.get<{ documents: DocumentResponse[]; total: number }>(`${this.URL}`, {
      params: new HttpParams({
        fromObject: { limit, offset, ...(term && { term }), ...this.removeEmptyParams(rest) },
      }),
    });
  }

  create(dto: DocumentDto, pdf: File) {
    console.log(dto);
    return this.uploadDocument(pdf, +dto.year).pipe(
      switchMap((fileUploaded) =>
        this.http.post<DocumentResponse>(`${this.URL}`, {
          ...dto,
          year: +dto.year,
          fileId: fileUploaded.id,
        }),
      ),
    );
  }

  update(id: string, dto: Partial<DocumentDto>, file: File | null) {
    const fileUploadObserbable: Observable<null | UploadResult> = file
      ? this.uploadDocument(file, dto.year ? +dto.year : undefined)
      : of(null);
    return fileUploadObserbable.pipe(
      switchMap((fileUploaded) =>
        this.http.patch<DocumentResponse>(`${this.URL}/${id}`, {
          ...dto,
          ...(dto.year && { year: +dto.year }),
          ...(fileUploaded && { fileId: fileUploaded.id }),
        }),
      ),
    );
  }

  searchRelationCandidates(term: string, targetDocumentId?: string) {
    return this.http.get<any[]>(`${this.URL}/search-for-relation`, {
      params: new HttpParams({
        fromObject: { term, ...(targetDocumentId && { targetDocumentId }) },
      }),
    });
  }

  getDocumentRelations(sourceId: string) {
    return this.http
      .get<any>(`${this.URL}/${sourceId}/relation`)
      .pipe(tap((resp) => console.log(resp)));
  }

  private removeEmptyParams(obj: object) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
    );
  }

  private uploadDocument(pdf: File, year: number | undefined) {
    const formData = new FormData();
    formData.append('file', pdf);
    const params = new HttpParams({ fromObject: { ...(year && { year: year.toString() }) } });

    return this.http.post<UploadResult>(`${environment.baseUrl}/files/documents`, formData, {
      params,
    });
  }
}
