import { bootstrap }    from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import { AppComponent } from './app.component';
import { GlobalPhoneBook } from './GlobalPhoneBook'; 


bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms(),
    GlobalPhoneBook 
]).catch((err: any) => console.error(err));
