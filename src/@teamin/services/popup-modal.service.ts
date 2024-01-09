import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from './api.service';
// import { TDynamicDailogueComponent } from '@teamin/components/t-dynamic-dailogue/t-dynamic-dailogue.component';
import { environment } from 'environments/environment';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupModalService {
  public APIUrl: string = environment.baseURL;
  constructor(private dialog: MatDialog, public _APIService: APIService) { }


  showDialog(dynamicComponents$: any) {
    // var url = this._APIService
    //   .getController('Office-Inventory-WareHouses-WareHouse-Create')
    //   .p.URL.toLowerCase();
    // var con = this._APIService.getController(
    //   'Office-Inventory-WareHouses-WareHouse-Create'
    // );

    // this.dialog.open(TDynamicDailogueComponent, { data: dynamicComponents$ });
  }
}
