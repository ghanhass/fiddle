import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { CodeEditorComponent } from "@ngstack/code-editor";
import { CommonService } from "../common.service";
@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css']
})
export class HtmlPartComponent implements OnInit {
  @Input()code: string = "";
  theme = 'vs-light';

  codeModel: any = {
    language: 'html',
    //uri: 'main.json',
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
    this.commonService.htmlCode = value;
  }

  ngOnInit(): void {
  }
  ngOnChanges(simpleChanges: SimpleChanges){
    if(simpleChanges["code"] !== undefined && simpleChanges["code"]["currentValue"] !== undefined){
      console.log("simpleChanges html code = ", this.code);
      this.codeModel.value = this.code;
    }
  }

}
