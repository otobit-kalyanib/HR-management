import { KeyValuePair } from "./common/key-value-pair";
export interface Organisation {
    OrganisationName?: string;
    OrganisationCode?: string;
    WebsiteURL?: string;
    LoginURL?: string;
    GUID?: string;
    Status?: boolean;
    Description?: string;
    LogoGUID?: string;
    HeaderGUID?: string;
    FooterGUID?: string;
    OrganisationType?: KeyValuePair;
    Data?: any;
}
