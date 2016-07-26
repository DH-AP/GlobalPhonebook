import { Component } from '@angular/core';
import { NgForm }    from '@angular/forms';

import { PhonebookEntry } from './PhonebookEntry';
import { GlobalPhoneBook } from './GlobalPhoneBook'; 

@Component({
    selector: 'register-form',
    templateUrl: 'app/register-form.component.html',
    providers: [GlobalPhoneBook]    
})

export class RegisterFormComponent {

    model = new PhonebookEntry('','','');
    submitted = false;
    accounts: any;
    selectedAccountBalance: any;

    constructor(private phonebook: GlobalPhoneBook){
        this.accounts = phonebook.getAccount();       
    }

    onSubmit() {        
        this.phonebook.registerPhonenumber(this.model);
        this.model = new PhonebookEntry('','','');
    }

    onSelectedAccount(value: string){
        this.selectedAccountBalance = 0;
        this.selectedAccountBalance = this.phonebook.getAccountBalance(value);
    }
    // get diagnostic() { return JSON.stringify(this.model); }

}