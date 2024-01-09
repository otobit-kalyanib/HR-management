import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TLoadingComponent } from './t-loading.component';

@NgModule({
    imports: [CommonModule],
    declarations: [TLoadingComponent],
    exports: [TLoadingComponent],
})
export class TLoadingModule {}
