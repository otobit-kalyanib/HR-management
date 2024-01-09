import { Component, ViewEncapsulation } from '@angular/core';

// import { TeamInSharedModule } from '@teamIn/shared.module';

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    // imports:[TeamInSharedModule]
})
export class ExampleComponent 
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
