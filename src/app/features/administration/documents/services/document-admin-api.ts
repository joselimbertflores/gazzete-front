import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of, switchMap } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DocumentDetailResponse, DocumentResponse } from '../interfaces';
export interface UploadResult {
  id: string;
  name: string;
}

interface EditableDocumentDto {
  summary?: string;
  status?: string;
  publicationDate?: Date;
  promulgationDate?: Date | null;
  validUntil?: Date | null;
  isFeatured?: boolean;
}

interface CreateDocumentDto extends EditableDocumentDto {
  summary: string;
  publicationDate: Date;
  year: string;
  typeId: number;
  correlativeNumber: number;
  suffix?: string | null;
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
  private http = inject(HttpClient);

  private readonly URL = `${environment.baseUrl}/api/documents`;
  documentTypes = toSignal(this.http.get<any[]>(`${this.URL}/types`), { initialValue: [] });

  findAll({ limit, offset, term, ...rest }: GetDocumentsParams) {
    return this.http.get<{ documents: DocumentResponse[]; total: number }>(`${this.URL}`, {
      params: new HttpParams({
        fromObject: { limit, offset, ...(term && { term }), ...this.removeEmptyParams(rest) },
      }),
    });
  }

  create(dto: CreateDocumentDto, pdf: File) {
    return this.uploadDocumentForCreate(pdf, +dto.year).pipe(
      switchMap((fileUploaded) =>
        this.http.post<DocumentResponse>(`${this.URL}`, {
          ...dto,
          year: +dto.year,
          fileId: fileUploaded.id,
        }),
      ),
    );
  }

  update(id: string, dto: EditableDocumentDto, file: File | null) {
    const fileUploadObservable: Observable<null | UploadResult> = file
      ? this.uploadDocumentForUpdate(id, file)
      : of(null);
    return fileUploadObservable.pipe(
      switchMap((fileUploaded) =>
        this.http.patch<DocumentResponse>(`${this.URL}/${id}`, {
          ...dto,
          ...(fileUploaded && { fileId: fileUploaded.id }),
        }),
      ),
    );
  }

  getDocumentDetail(id: string) {
    return this.http.get<DocumentDetailResponse>(`${this.URL}/${id}`);
  }

  private removeEmptyParams(obj: object) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== ''),
    );
  }

  private uploadDocumentForCreate(pdf: File, year: number) {
    const formData = new FormData();
    formData.append('file', pdf);
    const params = new HttpParams({ fromObject: { year: year.toString() } });

    return this.http.post<UploadResult>(`${this.URL}/files`, formData, { params });
  }

  private uploadDocumentForUpdate(id: string, pdf: File) {
    const formData = new FormData();
    formData.append('file', pdf);

    return this.http.post<UploadResult>(`${this.URL}/${id}/file`, formData);
  }
}
