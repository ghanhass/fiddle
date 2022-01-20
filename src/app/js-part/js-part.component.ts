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
    //contextmenu: false,
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
    this.oldCodeValue = this.mainService.jsCode;
    this.mainService.jsCode = value;

    if(this.oldCodeValue != value){
      window.removeEventListener("beforeunload", this.mainService.beforeUnloadListener, {capture: true});
      this.mainService.isBeforeUnloadEvHandlerSet = false;
      window.addEventListener("beforeunload", this.mainService.beforeUnloadListener, {capture: true});
      this.mainService.isBeforeUnloadEvHandlerSet = true;

      //console.log("js value = ", value);
    }
  }

  ngOnInit(): void {
  }

  onEditorLoad(editor){
    this.editor = editor;
    //console.log("editor = ", this.editor);

    let el = document.querySelector("app-js-part [class='monaco-editor']");
    let self = this;

    el.addEventListener("keydown", function(event: KeyboardEvent){

      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
          self.mainService.jsCode = self.oldCodeValue;
          self.code = self.oldCodeValue;
          self.runcodemsg.emit();
      }
      else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        if( self.mainService.codeExecutionDate === undefined || evDate.getTime() - self.mainService.codeExecutionDate.getTime() >= 1500){
          self.mainService.codeExecutionDate = evDate;
          self.savecodemsg.emit();
        }
      }
    });
  }

}
