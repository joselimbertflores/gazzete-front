import { Component, inject, input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { delay } from 'rxjs';

import { FileSizePipe, SafePipe } from '../../../../shared';
import { DocumentPublicApi } from '../../services';
@Component({
  selector: 'app-document-detail',
  imports: [CommonModule, SkeletonModule, ButtonModule, TagModule, FileSizePipe, SafePipe],
  templateUrl: './document-detail.html',
})
export default class DocumentDetail {
  private documentApi = inject(DocumentPublicApi);
  private location = inject(Location);
  private router = inject(Router);

  id = input.required<string>();

  docResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this.documentApi.findOne(params.id).pipe(delay(300)),
  });

  goBack() {
    if (window.history.length > 2) {
      this.location.back();
    } else {
      this.router.navigate(['/documents']);
    }
  }
}
