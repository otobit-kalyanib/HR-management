export class ResponseResult {
    LogId: string;
    Result: string;
    Message: string;
    Data: any;
}
export class ResponsePostModel {
    Post: any;
    Data: any;
    Validations: any;
}
export class ResponsePutModel {
    Put: any;
    Data: any;
    Validations: any;
}

export class ResponseDataModel {
    Records: any;
    Total: number;
    CurrentTotal: number;
    Filter: string;
    Sort: string;
    PageSize: number;
    PageNumber: number;
}

export class ValueDataModel {
    value: any;
}

export interface ResponseSchemaModel {
    Con: string;
    Mode: number;
    Schema: ResponseSchemaSchemaModel;
    Options: ResponseSchemaOptionsModel;
}

export interface ResponseSchemaOptionsModel {
    CreateCon: string;
    DeleteCon: string;
    DownloadCon:string;
    EditCon: string;
    ViewCon: string;
    PrintCon: string;
}

export interface ResponseSchemaSchemaModel {
    Keys: string[];
    OrderBy: string;
    Columns: ResponseSchemaSchemaColumnModel[];
}

export interface ResponseSchemaSchemaColumnModel {
    Name: string;
    Type: string;
}

export enum ResponseSchemaSchemaColumnTypeModel {
    Boolean = "Boolean",
    Int32 = "Int32",
    String = "String",
}

export class StudentAssingmentModel {
    AssignmentId: string;
    Dated: string;
    Description: string;
    ExternalLink: string;
    FGUID: string;
    PostedBy: string;
    PostedByIGUID: string;
    Subject: string;
    Title: string;
}

export class StudentNoticeModel {
    ApprovedBy: String;
    ApprovedDated: String;
    Category: String;
    Dated: String;
    Description: String;
    FGUID: String;
    NoticeId: String;
    PostedBy: String;
    Status: String;
    Title: String;
}
