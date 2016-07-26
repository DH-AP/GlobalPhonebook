export class PhonebookEntry{

    constructor(
        public phonenumber: string,
        public etheraddress: string,
        public password: string,
        public firstname?: string,
        public lastname?: string,
        public country?: string,
        public city?: string,
        public street?: string
    ){}

}