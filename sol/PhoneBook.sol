contract GlobalPhoneBook {

    //the "service" owner address
    address owner;

    //contractor
    function GlobalPhoneBook() {
        owner = msg.sender;
    }

    //phone book entry struct
    struct Entry {
        uint time;
        string firstName;
        string lastName;
        string phonenumber;
        string country;
        string city;
        string street;
        address entryAddress;
    }

    //GlobalPhoneBook size
    uint bookSize;
    //map one to many, address can have more than one phone number
    mapping (address => Entry) phonebookByAddrss;
    //map one to one, phone number can resolved to one address
    mapping (string => Entry) phonebookByNumber;

    enum PhoneBookAction {
        ADD,
        REMOVE,
        SEARCH_BY_ADDRESS,
        SEARCH_BY_PHONENUMBER
    }

    enum ActionResult {
        SUCCESS,
        FAIL
    }

    event PhoneEntryEvent(
        address sender,
        PhoneBookAction action,
        ActionResult result,
        string data
        );

    function addPhoneNumber(string firstname, string lastname, string phonenumber,
                            string country, string city, string street, address adrs) {

        if(phonebookByNumber[phonenumber].time == 0){

            //initialization the entry struct
            phonebookByNumber[phonenumber].time = now;
            phonebookByNumber[phonenumber].firstName = firstname;
            phonebookByNumber[phonenumber].lastName = lastname;
            phonebookByNumber[phonenumber].phonenumber = phonenumber;
            phonebookByNumber[phonenumber].country = country;
            phonebookByNumber[phonenumber].city = city;
            phonebookByNumber[phonenumber].street = street;

            //validate.
            //1. Only the service owner can register any phonenumber
            //2. sender can register only entry for itself address
            if(owner == msg.sender){
                phonebookByNumber[phonenumber].entryAddress = adrs;
            } else {
                phonebookByNumber[phonenumber].entryAddress = msg.sender;
            }

            //index second map by address (not postal address)
            phonebookByAddrss[adrs] = phonebookByNumber[phonenumber];

            bookSize++;
            PhoneEntryEvent(msg.sender, PhoneBookAction.ADD, ActionResult.SUCCESS, "Entry added successfully");
        } else {
            PhoneEntryEvent(msg.sender, PhoneBookAction.ADD, ActionResult.FAIL, "Entry exists");
            returnValue();
        }
    }

    function phonebookSize() constant returns (uint) {
        return bookSize;
    }

    function searchAddressByNumber(string phonenumber) constant returns (address) {
        PhoneEntryEvent(msg.sender, PhoneBookAction.SEARCH_BY_PHONENUMBER, ActionResult.SUCCESS, "");
        return phonebookByNumber[phonenumber].entryAddress;
    }

    function searchNumberByAddress(address adrs) constant returns (string) {
        PhoneEntryEvent(msg.sender, PhoneBookAction.SEARCH_BY_ADDRESS, ActionResult.SUCCESS, "");
        return phonebookByAddrss[adrs].phonenumber;
    }

    function kill() {
        if(owner == msg.sender){
            selfdestruct(owner);
            suicide(owner);
        }
    }

    function returnValue() internal {
        if (msg.value > 0) {
            msg.sender.send(msg.value);
        }
    }
}
