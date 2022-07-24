import { Component, OnInit, Input, SimpleChanges, Output,EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import { filter, take } from 'rxjs/operators';
import {
  MonacoEditorComponent,
  MonacoEditorConstructionOptions,
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor
} from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css']
})
export class HtmlPartComponent implements OnInit {
  code: string = "";
  
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();
  @Output()monacoeditorloaded: EventEmitter<string> = new EventEmitter();
  //@ViewChild("monaco") monaco:MonacoEditorComponent;

  oldCodeValue: string = "";
  editor: any;

  options = {
    language:"html",
    //contextmenu: false,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth:"1px",
    lineNumbersMinChars: 1,
    wordWrap:"on",
    baseUrl: "/"
  };

  constructor(private mainService:MainService,
  private monacoLoaderService: MonacoEditorLoaderService) {
  }

  ngOnInit(): void {
    this.code = this.mainService.htmlCode;
  }

  onEditorLoad(editor){
    this.editor = editor;
    //console.log("editor = ", this.editor);

    let el = document.querySelector("app-html-part [class='monaco-editor']");
    let self = this;

    this.monacoeditorloaded.emit();
    el.addEventListener("keydown", function(event: KeyboardEvent){

      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
        self.code = self.oldCodeValue;
        self.mainService.htmlCode = self.code;
        self.runcodemsg.emit();
      }
      else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        if( self.mainService.codeExecutionDate === undefined || evDate.getTime() - self.mainService.codeExecutionDate.getTime() >= 1500){
          self.mainService.codeExecutionDate = evDate;
          self.savecodemsg.emit();
        }
      }
    });
    this.mainService.resumeFiddleTheme();
  }

  onCodeChanged(value) {
    //console.log('CODE', value);
    this.oldCodeValue = this.mainService.htmlCode;
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

}
