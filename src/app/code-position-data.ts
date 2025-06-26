import { Ace } from "ace-builds";
import * as AceAjax from "brace";
import { Subject } from "rxjs";

export interface CodePositionData {
    row?: number, 
    column: number,
    focus: boolean,
    scrollHeight?: number,
    scrollTop?: number,
    aceRanges?: AceAjax.Range[]
}
