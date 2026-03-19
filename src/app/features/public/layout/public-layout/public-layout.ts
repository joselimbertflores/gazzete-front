import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PublicFooter, PublicNavbar } from './components';

@Component({
  selector: 'app-public-layout',
  imports: [RouterModule, PublicNavbar, PublicFooter],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PublicLayout {}
