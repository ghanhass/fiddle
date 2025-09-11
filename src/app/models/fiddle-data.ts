export interface FiddleData {
    id?:number,
    js?:string,
    html?:string,
    css?:string,
    pastebintext?: string,
    user_id?:string,
    title?:string,
    layout?:number,
    htmlPartSize?:number,
    cssPartSize?:number,
    jsPartSize?:number,
    codePartSize?:number,
    mainContainerSize?:number,
    maonContainerHeight?:number,
    mainContainerWidth?:number,
    mobileLayout?:string,
    iframeResizeValue?:number,
    isMobileMode?: boolean,
    createdAt?: number;
    appMode?: string
}