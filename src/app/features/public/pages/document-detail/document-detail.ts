import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TagModule } from 'primeng/tag';

import { DocumentPublicApi } from '../../services';
import { SafePipe } from '../../../../shared';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-document-detail',
  imports: [RouterLink, CommonModule, BreadcrumbModule, ButtonModule,TagModule, SafePipe],
  templateUrl: './document-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DocumentDetail {
  private documentApi = inject(DocumentPublicApi);
  private location = inject(Location);
  private router = inject(Router);

  id = input.required<string>();

  docResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.documentApi.findOne(params.id),
  });

  readonly breadcrumbItems = [
    { label: 'Inicio', routerLink: '/' },
    {
      label: 'Documentos',
      routerLink: '/documents',
    },
    {
      label: 'Detalle',
    },
  ];

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/documents']);
    }
  }
}
