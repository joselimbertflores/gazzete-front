import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

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
}
