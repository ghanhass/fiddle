import { Component, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css']
})
export class JsPartComponent implements OnInit {
  @Input()code: string = "";
  theme = 'vs-light';
  
  codeModel: any = {
    language: 'javascript',
    value: '',
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
  constructor(private mainService:MainService) {  }

  onCodeChanged(value) {
    //console.log('CODE', value);
    this.mainService.jsCode = value;
  }

  ngOnInit(): void {
  }

  ngOnChanges(data: SimpleChanges){
    //console.log("SimpleChanges data = ", data);
    if(data.code !== undefined && data.code.currentValue !== undefined){
      this.codeModel = {
        language: 'javascript',
        value: data.code.currentValue
      };
    }
  }
  
  ngOnChanges(simpleChanges: SimpleChanges){
    if(simpleChanges["code"] !== undefined && simpleChanges["code"]["currentValue"] !== undefined){
      console.log("simpleChanges js code = ", this.code);
      this.codeModel.value = this.code;
    }
  }

}
