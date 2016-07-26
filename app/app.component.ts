import { Component } from '@angular/core';

import { RegisterFormComponent } from './register.component';
import { SearchFormComponent } from './search.component';
import { GlobalPhoneBook } from './GlobalPhoneBook';

@Component({
    selector: 'my-app',
    template: 
    '<div class="container">'+
    '   <h1>Global Phonebook <span class="badge">{{phonebook.numberOfEntries}}</span></h1><br>' +
    '</div>' +   
    '<search-form></search-form>' +
    '<register-form></register-form>',
    directives: [RegisterFormComponent, SearchFormComponent],
    providers: [GlobalPhoneBook]
})

export class AppComponent { 

    numberOfEntries: number;

    constructor(private phonebook: GlobalPhoneBook){                   
    }
    
}
