export class ContactBankModel {
    public AccountNumber: string = "";
    public IFSCode: string = "";
    public IFSCDetail: IFSCModel = new IFSCModel();
    public BankName: string = "";
    public Address: string = "";
    public Branch: string = "";
}

export class IFSCModel {
    CENTRE: string = "";
    STATE: string = "";
    BRANCH: string = "";
    CONTACT: string = "";
    DISTRICT: string = "";
    NEFT: boolean = false;
    UPI: boolean = false;
    MICR: string = "";
    IMPS: boolean = false;
    CITY: string = "";
    RTGS: boolean = false;
    ADDRESS: string = "";
    BANK: string = "";
    BANKCODE: string = "";
    IFSC: string;
}
