import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MainService } from "../main.service";

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
  constructor(private mainService:MainService) { }

  ngOnInit(): void {
  }

  onCodeChanged(value) {
    //console.log('CODE', value);
    this.mainService.htmlCode = value;
    console.log("html value = ", value);
  }

  ngOnChanges(data: SimpleChanges){
    //console.log("SimpleChanges data = ", data);
    if(data.code !== undefined && data.code.currentValue !== undefined){
      this.codeModel = {
        language: 'html',
        value: data.code.currentValue
      };
    }
  }

}
