interface CdnjsResult{
    name?:string;
    description?:string;
    latest?: string;
    version?: string;
}
export interface Cdnjsdata {
    results: [CdnjsResult];
}
