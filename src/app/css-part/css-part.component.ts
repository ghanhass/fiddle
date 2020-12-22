import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { CommonService } from "../common.service";

@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  @Input()code: string = "";
  theme = 'vs-light';

  codeModel: any = {
    language: 'css',
    value: ""
  };

  options = {
    contextmenu: false,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth:"1px",
    lineNumbersMinChars: 1,
    wordWrap:"on",
    baseUrl: "/"
  };
  constructor(private commonService: CommonService) { }


  onCodeChanged(value) {
    //console.log('CODE', value);
    this.commonService.cssCode = value;
  }

  ngOnInit(): void {
  }

  ngOnChanges(simpleChanges: SimpleChanges){
    if(simpleChanges["code"] !== undefined && simpleChanges["code"]["currentValue"] !== undefined){
      console.log("simpleChanges css code = ", this.code);
      this.codeModel.value = this.code;
    }
  }

}
