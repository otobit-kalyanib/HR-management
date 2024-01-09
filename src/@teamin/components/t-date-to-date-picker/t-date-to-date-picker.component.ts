import {
    Component,
    Input,
    forwardRef,
    Injector,
    OnInit,
    ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { DateRange } from "@teamin/models/common/date-range";

import { ControlValueAccessorConnector } from "@teamin/helpers/control-value-accessor-connector";
import { APIService } from "@teamin/services/api.service";

import * as moment from "moment";
import { from } from "linq-to-typescript";

@Component({
    selector: "t-date-to-date-picker",
    templateUrl: "./t-date-to-date-picker.component.html",
    styleUrls: ["./t-date-to-date-picker.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TDateToDatePickerComponent),
            multi: true,
        },
    ],
})
export class TDateToDatePickerComponent extends ControlValueAccessorConnector {
    constructor(injector: Injector, private _apiService: APIService) {
        super(injector);
    }

    @Input() dt: string;
    @Input() dt1: string;
    @Input() isDisabled: boolean;

    public dateRange: DateRange;

    ngOnInit() {
        var v = this.control.value;
        if (v != null)
            if (v.FromDate != null && v.ToDate != null)
                this.dateRange = {
                    FromDate: moment(v.FromDate).toDate(),
                    ToDate: moment(v.ToDate).toDate(),
                };
            else
                this.dateRange = {
                    FromDate: null,
                    ToDate: null,
                };
    }

    public onChange($event) {
        var v = this.dateRange;
        if (v) {
            this.control.setValue(v);
        }

        this.change.emit($event);
    }

    @ViewChild("dropdownlist", { static: true }) public dropdownlist: any;

    public toggle: boolean = false;

    public toggleClick() {
        this.toggle = !this.toggle;
        setTimeout(() => {
            this.dropdownlist.toggle(this.toggle);
        }, 0);
    }

    public onDropChange($event) {
        var d: any = from(this.data)
            .where((x: any) => x.Id == $event.Id)
            .first();

        this.dateRange = d.fn();

        this.dropdownlist.toggle(false);
        this.toggleClick();
        this.onChange($event);
    }

    public data: any = [
        {
            Id: 0,
            Text: "None",
            fn: (): DateRange => {
                return {
                    FromDate: null,
                    ToDate: null,
                };
            },
        },
        {
            Id: 1,
            Text: "Today",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).toDate(),
                    ToDate: moment(Date.now()).toDate(),
                };
            },
        },
        {
            Id: 2,
            Text: "Yesterday",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).add(-1, "d").toDate(),
                    ToDate: moment(Date.now()).add(-1, "d").toDate(),
                };
            },
        },
        {
            Id: 3,
            Text: "This week",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).startOf("isoWeek").toDate(),
                    ToDate: moment(Date.now()).endOf("isoWeek").toDate(),
                };
            },
        },
        {
            Id: 4,
            Text: "Last week",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now())
                        .add(-1, "w")
                        .startOf("isoWeek")
                        .toDate(),
                    ToDate: moment(Date.now())
                        .add(-1, "w")
                        .endOf("isoWeek")
                        .toDate(),
                };
            },
        },
        {
            Id: 5,
            Text: "Next week",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now())
                        .add(1, "w")
                        .startOf("isoWeek")
                        .toDate(),
                    ToDate: moment(Date.now())
                        .add(1, "w")
                        .endOf("isoWeek")
                        .toDate(),
                };
            },
        },
        {
            Id: 6,
            Text: "This month",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).startOf("month").toDate(),
                    ToDate: moment(Date.now()).endOf("month").toDate(),
                };
            },
        },
        {
            Id: 7,
            Text: "Last month",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now())
                        .add(-1, "month")
                        .startOf("month")
                        .toDate(),
                    ToDate: moment(Date.now())
                        .add(-1, "month")
                        .endOf("month")
                        .toDate(),
                };
            },
        },
        {
            Id: 8,
            Text: "Next month",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now())
                        .add(1, "month")
                        .startOf("month")
                        .toDate(),
                    ToDate: moment(Date.now())
                        .add(1, "month")
                        .endOf("month")
                        .toDate(),
                };
            },
        },
        {
            Id: 9,
            Text: "This year",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).startOf("year").toDate(),
                    ToDate: moment(Date.now()).endOf("year").toDate(),
                };
            },
        },
        {
            Id: 10,
            Text: "Last year",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now())
                        .add(-1, "year")
                        .startOf("year")
                        .toDate(),
                    ToDate: moment(Date.now())
                        .add(-1, "year")
                        .endOf("year")
                        .toDate(),
                };
            },
        },
        {
            Id: 11,
            Text: "Next year",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now())
                        .add(1, "year")
                        .startOf("year")
                        .toDate(),
                    ToDate: moment(Date.now())
                        .add(1, "year")
                        .endOf("year")
                        .toDate(),
                };
            },
        },
        {
            Id: 12,
            Text: "This financial year",
            fn: (): DateRange => {
                var m = moment(Date.now()).month();
                let r1: moment.MomentInput;
                var r2: moment.MomentInput;
                if (m <= 2) {
                    r1 = moment(Date.now())
                        .subtract(1, "year")
                        .month(3)
                        .startOf("month");
                    r2 = moment(Date.now()).month(2).endOf("month");
                } else {
                    r1 = moment(Date.now()).month(3).startOf("month");
                    r2 = moment(Date.now())
                        .add(1, "year")
                        .month(2)
                        .endOf("month");
                }

                return {
                    FromDate: r1.toDate(),
                    ToDate: r2.toDate(),
                };
            },
        },
        {
            Id: 13,
            Text: "Last financial year",
            fn: (): DateRange => {
                var m = moment(Date.now()).add(-1, "year").month();
                var r1, r2;
                if (m <= 2) {
                    r1 = moment(Date.now())
                        .add(-1, "year")
                        .subtract(1, "year")
                        .month("April")
                        .startOf("month");
                    r2 = moment(Date.now())
                        .add(-1, "year")
                        .month("March")
                        .endOf("month");
                } else {
                    r1 = moment(Date.now())
                        .add(-1, "year")
                        .month("April")
                        .startOf("month");
                    r2 = moment(Date.now())
                        .add(-1, "year")
                        .add(1, "year")
                        .month("March")
                        .endOf("month");
                }

                return {
                    FromDate: r1.toDate(),
                    ToDate: r2.toDate(),
                };
            },
        },
        {
            Id: 14,
            Text: "Next financial year",
            fn: (): DateRange => {
                var m = moment(Date.now()).add(1, "year").month();
                var r1, r2;
                if (m <= 2) {
                    r1 = moment(Date.now())
                        .add(1, "year")
                        .subtract(1, "year")
                        .month("April")
                        .startOf("month");
                    r2 = moment(Date.now())
                        .add(1, "year")
                        .month("March")
                        .endOf("month");
                } else {
                    r1 = moment(Date.now())
                        .add(1, "year")
                        .month("April")
                        .startOf("month");
                    r2 = moment(Date.now())
                        .add(1, "year")
                        .add(1, "year")
                        .month("March")
                        .endOf("month");
                }

                return {
                    FromDate: r1.toDate(),
                    ToDate: r2.toDate(),
                };
            },
        },
        {
            Id: 15,
            Text: "Quaterly",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).toDate(),
                    ToDate: moment(Date.now())
                        .add(-3, "month")
                        .toDate(),
                };
            },
        },
        {
            Id: 16,
            Text: "Half year",
            fn: (): DateRange => {
                return {
                    FromDate: moment(Date.now()).toDate(),
                    ToDate: moment(Date.now())
                        .add(-6, "month")
                        .toDate(),
                };
            },
        },
    ];
}
