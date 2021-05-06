import { Component, OnInit, Input, SimpleChanges, Output,EventEmitter } from '@angular/core';
import { MainService } from "../main.service";

@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css']
})
export class HtmlPartComponent implements OnInit {
  @Input()code: string = "";
  
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();

  oldCodeValue: string = "";
  editor: any;

  options = {
    language:"html",
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

  constructor(private mainService:MainService) { }

  ngOnInit(): void {
  }

  onEditorLoad(editor){
    this.editor = editor;
    console.log("editor = ", this.editor);

    let el = document.querySelector("app-html-part [class='monaco-editor']");
    let self = this;

    el.addEventListener("keydown", function(event: KeyboardEvent){

      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
          self.mainService.htmlCode = self.oldCodeValue;
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

  onCodeChanged(value) {
    //console.log('CODE', value);
    this.oldCodeValue = this.mainService.htmlCode;
    this.mainService.htmlCode = value;
    //console.log("html value = ", value);
  }

}
