import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { TModalComponent } from "./t-modal.component";

@NgModule({
    declarations: [TModalComponent],
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    exports: [TModalComponent],
})
export class TModalModule {}
