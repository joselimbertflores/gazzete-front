import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DocumentResponse, RelationCandidateResponseDto } from '../interfaces';
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
@Injectable({
  providedIn: 'root',
})
export class DocumentAdminApi {
  private readonly URL = `${environment.baseUrl}/documents`;

  private http = inject(HttpClient);

  types = toSignal(this.http.get<any[]>(`${this.URL}/types`), {
    initialValue: [],
  });

  constructor() {}

  findAll(limit: number, offset: number, term?: string) {
    return this.http
      .get<{ documents: DocumentResponse[]; total: number }>(`${this.URL}`, {
        params: new HttpParams({ fromObject: { limit, offset, ...(term && { term }) } }),
      })
      .pipe(tap((resp) => console.log(resp)));
  }

  create(dto: DocumentDto, pdf: File) {
    return this.uploadDocument(pdf, +dto.year).pipe(
      switchMap((fileUploaded) =>
        this.http.post(`${this.URL}`, {
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
        this.http.patch(`${this.URL}/${id}`, {
          ...dto,
          ...(dto.year && { year: +dto.year }),
          ...(fileUploaded && { fileId: fileUploaded.id }),
        }),
      ),
    );
  }

  searchRelationCandidates(term: string, targetDocumentId?: string) {
    return this.http.get<RelationCandidateResponseDto[]>(`${this.URL}/search-for-relation`, {
      params: new HttpParams({
        fromObject: { term, ...(targetDocumentId && { targetDocumentId }) },
      }),
    });
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
