import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  code: string = "";

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
    //contextmenu: false,
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
    this.mainService.setCheckBeforeUnloadListener();
  }

  ngOnInit(): void {
    this.code = this.mainService.cssCode;
  }

  ngOnChanges(data: SimpleChanges){
    //console.log("SimpleChanges data = ", data);
  }

  onEditorLoad(editor){
    this.editor = editor;
    //console.log("editor = ", this.editor);

    let el = document.querySelector("app-css-part [class='monaco-editor']");
    let self = this;

    el.addEventListener("keydown", function(event: KeyboardEvent){

      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
          self.code = self.oldCodeValue;
          self.mainService.cssCode = self.code;
          //console.log("self.runcodemsg.emit()");
          self.runcodemsg.emit();
      }
      else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        if( self.mainService.codeExecutionDate === undefined || evDate.getTime() - self.mainService.codeExecutionDate.getTime() >= 1500){
          //console.log("self.savecodemsg.emit()");
          self.mainService.codeExecutionDate = evDate;
          self.savecodemsg.emit();
        }
      }
    });
  }


}
