import { DOCUMENT } from '@angular/common';
import { inject, Injectable, REQUEST } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';

export type OpenGraphType = 'article' | 'website';

export interface PageMetadata {
  title: string;
  description: string;
  path: string | null;
  type: OpenGraphType;
}

const SOCIAL_IMAGE_PATH = '/images/gaceta/gaceta-hero-banner-1280.webp';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  setPage(metadata: PageMetadata): void {
    const description = this.truncateDescription(metadata.description);
    const pageUrl = metadata.path === null ? null : this.buildPublicUrl(metadata.path);

    this.title.setTitle(metadata.title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: metadata.title }, "property='og:title'");
    this.meta.updateTag(
      { property: 'og:description', content: description },
      "property='og:description'",
    );
    this.meta.updateTag({ property: 'og:type', content: metadata.type }, "property='og:type'");
    this.meta.updateTag(
      { property: 'og:image', content: this.buildPublicUrl(SOCIAL_IMAGE_PATH) },
      "property='og:image'",
    );

    if (pageUrl) {
      this.meta.updateTag({ property: 'og:url', content: pageUrl }, "property='og:url'");
      this.setCanonical(pageUrl);
      return;
    }

    this.meta.removeTag("property='og:url'");
    this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.remove();
  }

  truncateDescription(value: string, maxLength = 160): string {
    const normalized = value.replace(/\s+/g, ' ').trim();

    if (normalized.length <= maxLength) return normalized;

    const candidate = normalized.slice(0, maxLength - 1);
    const lastSpace = candidate.lastIndexOf(' ');
    const truncated =
      lastSpace >= Math.floor(maxLength * 0.65) ? candidate.slice(0, lastSpace) : candidate;

    return `${truncated.trimEnd()}…`;
  }

  private buildPublicUrl(path: string): string {
    const configuredBaseUrl = environment.publicBaseUrl.trim();
    const baseUrl = configuredBaseUrl || this.request?.url || this.document.baseURI;

    return new URL(path, baseUrl).toString();
  }

  private setCanonical(url: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }

    canonical.href = url;
  }
}
