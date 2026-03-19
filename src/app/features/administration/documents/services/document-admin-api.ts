import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { Observable, of, switchMap } from 'rxjs';
export interface UploadResult {
  id: string;
  name: string;
}

interface DocumentDto {
  publicationDate: Date;
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
    return this.http.get<{ documents: any[]; total: number }>(`${this.URL}`, {
      params: new HttpParams({ fromObject: { limit, offset, ...(term && { term }) } }),
    });
  }

  create(data: DocumentDto, pdf: File) {
    return this.uploadDocument(pdf, data.publicationDate.getFullYear()).pipe(
      switchMap((fileUploaded) =>
        this.http.post(`${this.URL}`, {
          ...data,
          fileId: fileUploaded.id,
        }),
      ),
    );
  }

  update(id: string, data: Partial<DocumentDto>, file: File | null) {
    const fileUploadObserbable: Observable<null | UploadResult> = file
      ? this.uploadDocument(file, data.publicationDate?.getFullYear())
      : of(null);
    return fileUploadObserbable.pipe(
      switchMap((fileUploaded) =>
        this.http.patch(`${this.URL}/${id}`, {
          ...data,
          ...(fileUploaded && { fileId: fileUploaded.id }),
        }),
      ),
    );
  }

  searchDocumentForRelation(term: string, targetDocumentId?: string) {
    return this.http.get<any[]>(`${this.URL}/search-for-relation`, {
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
