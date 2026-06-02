import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { UserRole } from '../../../../core/auth/auth.types';
import { IdentityCandidateResponse, UserResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private http = inject(HttpClient);
  private readonly URL = `${environment.baseUrl}/api/users`;

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({ fromObject: { limit, offset, ...(term && { term }) } });
    return this.http.get<{ users: UserResponse[]; total: number }>(this.URL, {
      params,
    });
  }

  update(id: string, roles: string[]) {
    return this.http.patch<UserResponse>(`${this.URL}/${id}/role`, { roles });
  }

  findIdentityCandidates(term: string) {
    return this.http.get<IdentityCandidateResponse[]>(`${this.URL}/identity-candidates`, {
      params: new HttpParams({ fromObject: { term } }),
    });
  }

  importFromIdentity(externalKey: string, roles: UserRole[]) {
    return this.http.post<UserResponse>(`${this.URL}/import-from-identity`, {
      externalKey,
      roles,
    });
  }
}
