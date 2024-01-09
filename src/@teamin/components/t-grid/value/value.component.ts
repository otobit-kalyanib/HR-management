import { Inject, LOCALE_ID, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { TValidators } from "@teamin/helpers/t-validators";
import { TPageMaster } from "@teamin/helpers/t-page-master";
import { APIService } from "@teamin/services/api.service";
import { IntlService } from "@progress/kendo-angular-intl";
import * as moment from "moment";
import { DataSourceRequestState } from "@progress/kendo-data-query";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
})
export class ValueComponent extends TPageMaster {



  constructor(
    public route: ActivatedRoute,
    public _apiService: APIService,
    public _confirmationDialogService: FuseConfirmationService,
    public _location: Location,
    public _router: Router,
    public _dialog: MatDialog,
    public _intlService: IntlService,
    @Inject(LOCALE_ID) public localeId: string,
    @Inject(MAT_DIALOG_DATA) public json: string,

  ) {
    super(
      route,
      _apiService,
      _confirmationDialogService,
      _location,
      _router
    );
  }

  ngOnInit(): void {

  }

}
