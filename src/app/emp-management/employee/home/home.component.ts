import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
// import { FuseVerticalNavigationBasicItemComponent} from '@fuse/components/navigation/vertical/components/basic/basic.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,DropDownsModule,ReactiveFormsModule,FuseVerticalNavigationComponent,FuseLoadingBarComponent, FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, NotificationsComponent, UserComponent, NgIf, RouterOutlet, QuickChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{
  dynamicForm: FormGroup;
  isScreenSmall: boolean;
  navigation: Navigation;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private fb: FormBuilder,private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,) { }
    createProjectFormGroup(): FormGroup {
      return this.fb.group({
        projectType: '',   
        hoursSpent: 0      
      });
    }
    
    onNumberOfProjectsChange() {
      console.log('Number of projects changed');
      const numberOfProjects = this.dynamicForm.get('numberOfProjects').value;
      const projectsArray = this.dynamicForm.get('projects') as FormArray;
      console.log('Number of projects changed:', numberOfProjects);
    
    
      while (projectsArray.length !== numberOfProjects) {
        console.log('Inside the loop');
      
        if (projectsArray.length < numberOfProjects) {
          projectsArray.push(this.createProjectFormGroup());
        } else {
          projectsArray.removeAt(projectsArray.length - 1);
        }
      }
    }
    
    get projectControls() {
      return (this.dynamicForm.get('projects') as FormArray).controls as FormGroup[];
    }
  ngOnInit(): void {
    this.dynamicForm = this.fb.group({
      numberOfProjects: 1,
      projects: this.fb.array([this.createProjectFormGroup()])
    });

      this._navigationService.navigation$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((navigation: Navigation) =>
          {
              this.navigation = navigation;
          });

      // Subscribe to media changes
      this._fuseMediaWatcherService.onMediaChange$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(({matchingAliases}) =>
          {
              // Check if the screen is small
              this.isScreenSmall = !matchingAliases.includes('md');
          });
    
  }
 


  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  toggleNavigation(name: string): void
  {
      // Get the navigation
      const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

      if ( navigation )
      {
          // Toggle the opened status
          navigation.toggle();
      }
  }
  

  
  onSubmit() {
    // Handle form submission logic here
    console.log(this.dynamicForm.value);
  }
}
