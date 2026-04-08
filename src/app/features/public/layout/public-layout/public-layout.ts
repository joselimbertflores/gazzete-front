import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ScrollTopModule } from 'primeng/scrolltop';

import { PublicFooter, PublicNavbar } from './components';

@Component({
  selector: 'app-public-layout',
  imports: [RouterModule, ScrollTopModule, PublicNavbar, PublicFooter],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PublicLayout {}
