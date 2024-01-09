import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MatTooltipModule } from "@angular/material/tooltip";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";

import { TMultiColumnSearchComponent } from "./t-multicolumn-search.component";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { TCreateComponent } from "@teamin/layouts/t-create/t-create.component";
// import { CsdrawerModule } from "app/layout/common/csdrawer/csdrawer.module";

@NgModule({
    declarations: [TMultiColumnSearchComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        DropDownsModule,
        MatSidenavModule,
        // CsdrawerModule
    ],
    exports: [TMultiColumnSearchComponent],
    providers:[TCreateComponent]
})
export class TMultiColumnSearchModule {



}

