import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 't-tabledata',
    templateUrl: './tabledata.component.html',
    styleUrls: ['./tabledata.component.scss']
})
export class TabledataComponent implements OnInit {

    public head: any = [];
    @Input() _TableData: any;
    @Input() HeadingData: any;

    constructor() {
    }

    ngOnInit(): void {
     
        
        this.HeadingData.forEach(item => {
            this.head.push(item.replace(" ", ""))
        });
    }
}
