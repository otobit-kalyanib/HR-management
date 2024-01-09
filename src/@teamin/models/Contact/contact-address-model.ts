import { KeyValuePair } from "../common/key-value-pair";

export class ContactAddressModel {
    public Street: string = "";
    public Area: string = "";
    public City: string = "";
    public District: string = "";
    public State: KeyValuePair = { Id: null, Text: null };
    public Pincode: string = "";
    public Landmark: string = "";
}
