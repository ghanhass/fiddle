import { Ace } from "ace-builds";
import { Subject } from "rxjs";

export interface CodePositionData {
    lineNumber: number, 
    row?: number, 
    column: number,
    focus: boolean,
    scrollHeight?: number,
    scrollTop?: number,
    aceRanges?: Ace.Range[]
}
