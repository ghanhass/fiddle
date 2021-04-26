import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  @Input()code: string = "";

  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();

  oldCodeValue: string = "";
  editor: any;

  /*codeModel: any = {
    language: 'css',
    value: ""
  };*/

  options = {
    language:"css",
    contextmenu: false,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth:"1px",
    lineNumbersMinChars: 1,
    wordWrap:"on",
    baseUrl: "/",
    theme : 'vs-light'
  };
  constructor(private mainService: MainService) { }


  onCodeChanged(value) {
    //console.log('CODE', value);
    this.oldCodeValue = this.mainService.cssCode;
    this.mainService.cssCode = value;
  }

  ngOnInit(): void {
  }

  ngOnChanges(data: SimpleChanges){
    //console.log("SimpleChanges data = ", data);
    if(data.code !== undefined && data.code.currentValue !== undefined){
      /*this.codeModel = {
        language: 'css',
        value: data.code.currentValue
      };*/
    }
  }

  onEditorLoad(editor){
    this.editor = editor;
    console.log("editor = ", this.editor);

    let el = document.querySelector("app-css-part [class='monaco-editor']");
    let self = this;
    el.addEventListener("keyup", function(event: KeyboardEvent){
      if(event.code == "Enter" || event.code == "NumpadEnter"){
        if(self.mainService.isCtrlKeyOn){
          if(self.mainService.canEmitCodeMsg){
            self.runcodemsg.emit();
            self.mainService.canEmitCodeMsg = false;
            setTimeout(()=>{
              self.mainService.canEmitCodeMsg = true;
            },2000);
          }
        }
      }

      if(event.code == "KeyS"){
        if(self.mainService.isAltKeyOn){
          if(self.mainService.canEmitCodeMsg){
            self.savecodemsg.emit();
            self.mainService.canEmitCodeMsg = false;
            setTimeout(()=>{
              self.mainService.canEmitCodeMsg = true;
            },2000);
          }
        }
      }
    });

    el.addEventListener("keydown", function(event: KeyboardEvent){
      if(event.code == "Enter" || event.code == "NumpadEnter"){
        if(self.mainService.isCtrlKeyOn){
          console.log("keydown enter !");
          self.mainService.cssCode = self.oldCodeValue;
          self.code = self.oldCodeValue;
        }
      }
    });
  }


}
