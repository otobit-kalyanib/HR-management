import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 't-loading',
    templateUrl: './t-loading.component.html',
    styleUrls: ['./t-loading.component.scss'],
})
export class TLoadingComponent implements OnInit {
    constructor() {}

    @Input()
    isLoading: boolean;

    @Input()
    text: string;

    ngOnInit() {}
}
