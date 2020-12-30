import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  @Input()code: string = "";
  theme = 'vs-light';
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();

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

  toggleFullScreenMode(){
    this.isFullScreenMode = !this.isFullScreenMode;
    this.toggleFullScreen.emit(this.isFullScreenMode? "1" : "0");
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
