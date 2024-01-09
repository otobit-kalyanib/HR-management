import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 't-addressdata',
    templateUrl: './addressdata.component.html',
    styleUrls: ['./addressdata.component.scss']
})
export class AddressdataComponent implements OnInit {

    @Input() _Data: any;
    @Input() dt: any;
    @Input() bgColor: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }

}
