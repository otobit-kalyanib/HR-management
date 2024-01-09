import { KeyValuePair } from "../common/key-value-pair";

export class ContactNumberModel {
    public ContactNumberType: KeyValuePair = {
        Id: 2002,
        Text: "Mobile",
    };
    public CountryCode: string = "91";
    public ContactNumber: string = "";
    public readonly FullNumber: string = this.CountryCode + this.ContactNumber;
}
