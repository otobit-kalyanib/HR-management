import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '@teamin/services/api.service';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';

export interface SuperModel {
    _route?: ActivatedRoute;
    _location?: Location;
    _APIService?: APIService;
    _dialogService?: FuseConfirmationService;
}
