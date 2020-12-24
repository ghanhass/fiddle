import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MainService } from "../main.service";

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
  constructor(private mainService: MainService) { }


  onCodeChanged(value) {
    //console.log('CODE', value);
    this.mainService.cssCode = value;
  }

  ngOnInit(): void {
  }

  ngOnChanges(data: SimpleChanges){
    //console.log("SimpleChanges data = ", data);
    if(data.code !== undefined && data.code.currentValue !== undefined){
      this.codeModel = {
        language: 'css',
        value: data.code.currentValue
      };
    }
  }


}
