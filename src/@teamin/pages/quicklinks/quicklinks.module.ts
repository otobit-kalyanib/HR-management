import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
// import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
// import { QuicklinksComponent } from 'app/layout/common/quicklinks/quicklinks.component';
import { QuicklinksRoutes } from './quicklinks.routing';


@NgModule({
  declarations: [
    // QuicklinksComponent
  ],
  imports: [
    RouterModule.forChild(QuicklinksRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    // FuseAlertModule,
    SharedModule
  ]
})
export class QuicklinksModule { }
