import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: "t-modal",
    templateUrl: "./t-modal.component.html",
})
export class TModalComponent {
    constructor(
        public dialogRef: MatDialogRef<TModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ModalData
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

export class ModalData {
    component: any;
    message: string;
    title: string;
}
