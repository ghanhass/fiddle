import { Component, OnInit, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css']
})
export class JsPartComponent implements OnInit {
  @Input()code: string = "";
  theme = 'vs-light';
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();

  oldCodeValue: string = "";
  editor:any;

  options = {
    language:"javascript",
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
  constructor(private mainService:MainService) {  }

  onCodeChanged(value) {
    //console.log('CODE', value);
    this.oldCodeValue = this.mainService.jsCode;
    this.mainService.jsCode = value;
  }

  ngOnInit(): void {
  }

  onEditorLoad(editor){
    this.editor = editor;
    console.log("editor = ", this.editor);

    let el = document.querySelector("app-js-part [class='monaco-editor']");
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
          self.mainService.jsCode = self.oldCodeValue;
          self.code = self.oldCodeValue;
        }
      }
    });
  }

}
