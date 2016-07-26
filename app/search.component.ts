import { Component } from '@angular/core';
import { NgForm }    from '@angular/forms';

import { PhonebookEntry } from './PhonebookEntry';
import { GlobalPhoneBook } from './GlobalPhoneBook'; 

@Component({
    selector: 'search-form',
    template:   '<div class="container" >' +
                '   <p><label>Search</label> '+
                '   <input type="text" class="form-control" #searchbox (keyup.enter)="search(searchbox.value)" size="40"></p>' +
                '   <label [hidden]="searchAnswer==\'0x0000000000000000000000000000000000000000\'">{{searchAnswer}}</label>' +                
                '</div>',
    providers: [GlobalPhoneBook]    
})

export class SearchFormComponent {

    searchAnswer = '0x0000000000000000000000000000000000000000';

    constructor(private phonebook: GlobalPhoneBook){
    }

    search(value: string){        
        this.searchAnswer = this.phonebook.search(value);        
    }

}