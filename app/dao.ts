import * as mongodb from 'mongodb-async-wrapper';

export class Dao {

    constructor(){
        var db = mongodb.MongoClient.connect('mongodb://127.0.0.1');        
    }

}