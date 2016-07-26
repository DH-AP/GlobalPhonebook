import { Injectable } from '@angular/core';
import { PhonebookEntry } from './PhonebookEntry'; 

declare var Web3: any;
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let events: any;

enum ActionResult {
    Success,
    Fail
}

@Injectable()
export class GlobalPhoneBook {


    // globalPhoneBookAddress = '0x235ae03c5743f814cfbf001e2d7365e0596b3761';
    // globalPhoneBookAddress = '0x9e94b55feaf006cda571b4f298b1d248a592cf31';
    // globalPhoneBookAddress = '0x42d3617a03aaa2834b6736120fbbd540ddee360d';
    globalPhoneBookAddress = '0x21694b53af1a9ab9c57796402d884c6788e17bf2';
    globalPhoneBookAddressABI = JSON.parse('[{"constant":true,"inputs":[{"name":"adrs","type":"address"}],"name":"searchNumberByAddress","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"phonebookSize","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"phonenumber","type":"string"}],"name":"searchAddressByNumber","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstname","type":"string"},{"name":"lastname","type":"string"},{"name":"phonenumber","type":"string"},{"name":"country","type":"string"},{"name":"city","type":"string"},{"name":"street","type":"string"},{"name":"adrs","type":"address"}],"name":"addPhoneNumber","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"action","type":"GlobalPhoneBook.PhoneBookAction"},{"indexed":false,"name":"result","type":"GlobalPhoneBook.ActionResult"},{"indexed":false,"name":"data","type":"string"}],"name":"PhoneEntryEvent","type":"event"}]');

    contract: any;
    numberOfEntries: number;

    constructor() {
        
        // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        this.contract = 
                    web3.eth.contract(this.globalPhoneBookAddressABI)
                            .at(this.globalPhoneBookAddress);

        events = web3.eth.filter([this.contract.PhoneEntryEvent]);
        
        this.getNumberOfEntries();  
    }

    getAccount(){
        return web3.eth.accounts;
    }

    getAccountBalance(value: string){
        return web3.fromWei(web3.eth.getBalance(value),'ether');
    }

    getNumberOfEntries(){
        this.numberOfEntries = this.contract.phonebookSize();
        return this.numberOfEntries;
    }

    search(key: string){
        let value = localStorage.getItem(key);
        
        if(value == null){
            if(key.match("^[0-9]")){
                if(key.startsWith('0x')){
                    value = this.searchNumberByAddress(key);
                } else {
                    value = this.searchAddressByNumber(key);
                }
                localStorage.setItem(key, value);
            } else {
                value = '0x0000000000000000000000000000000000000000';
            }       
        }        
        return value;
    }

    registerPhonenumber(entry: PhonebookEntry){
        web3.eth.defaultAccount = entry.etheraddress;
        
        events.watch(
            function(error: any, result: any) {
                console.log(JSON.stringify(result, null, 4));
                var actionresult = web3.toDecimal(result.topics[3]);
                console.log('Action Result --> ' + ActionResult[actionresult]);
                console.log('Data string --> ' + web3.toAscii(result.data));
                events.stopWatching();
            }
        );

        web3.personal.unlockAccount(entry.etheraddress, entry.password, 30);
        
        this.contract.addPhoneNumber.sendTransaction('', 
                                     '', 
                                     entry.phonenumber, 
                                     '', 
                                     '', 
                                     '', 
                                     entry.etheraddress,
                                     {gas: 500000});

        web3.personal.lockAccount(entry.etheraddress);

        //clean on localStorage entries
        localStorage.removeItem(entry.phonenumber);
        localStorage.removeItem(entry.etheraddress);

        this.getNumberOfEntries();

    }

    searchAddressByNumber(value: string){    
        return this.contract.searchAddressByNumber(value);
    }

    searchNumberByAddress(value: string){
        return this.contract.searchNumberByAddress(value);
    }
}