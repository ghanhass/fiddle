import { Subject } from "rxjs";

export interface CodePositionData {
    lineNumber: number, 
    row?: number, 
    column: number,
    focus: boolean,
    scrollHeight?: number,
    scrollTop?: number
}
