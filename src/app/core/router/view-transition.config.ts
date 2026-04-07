import { inject } from '@angular/core';
import { Router, isActive, IsActiveMatchOptions, ViewTransitionInfo } from '@angular/router';

export function handleTransitionCreated({ transition }: ViewTransitionInfo) {
  const router = inject(Router);
  const targetUrl = router.currentNavigation()!.finalUrl!;
  const config: Partial<IsActiveMatchOptions> = {
    paths: 'exact',
    matrixParams: 'exact',
    fragment: 'ignored',
    queryParams: 'ignored',
  };
  const isTargetRouteCurrent = isActive(targetUrl, router, config);
  if (isTargetRouteCurrent()) {
    transition.skipTransition();
  }
}
