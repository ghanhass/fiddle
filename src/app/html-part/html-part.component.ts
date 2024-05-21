import { Component, OnInit, Input, SimpleChanges, Output,EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import {
  MonacoEditorLoaderService,
  MonacoStandaloneCodeEditor
} from '@materia-ui/ngx-monaco-editor';
import { AceEditorComponent } from 'ng2-ace-editor';

import {Ace} from 'ace-builds/ace';

@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css']
})
export class HtmlPartComponent implements OnInit {
  code: string = "";
  theme: string = "cloud9_day";
  
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();
  @Output()monacoeditorloaded: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

  editor: MonacoStandaloneCodeEditor;
 @ViewChild("aceeditor") aceeditor: AceEditorComponent;
 aceEditor: Ace.Editor;

  options = {
    language:"html",
    //contextmenu: false,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth:"1px",
    lineNumbersMinChars: 1,
    wordWrap:"on",
    baseUrl: "/",
    contextmenu: false
  };

  constructor(private mainService:MainService,
  private monacoLoaderService: MonacoEditorLoaderService) {
  }

  ngOnInit(): void {
    this.canRetrievePositionsAfterLoad = true;
    
    this.code = this.mainService.htmlCode;
    console.log("HtmlPartComponent ngOnInit");
  }

  ngAfterViewInit(){
    console.log("HtmlPartComponent ngAfterViewInit");

    this.aceEditor = this.aceeditor.getEditor() ;
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    //console.log("called retrieveCodePartsCursors() from HtmlPartComponent !");
    //this.mainService.retrieveCodePartsCursors(undefined, this);
    
    /*let x: Ace.Range[] = [];
    this.aceEditor.on("copy", (ev)=>{
      //x = this.aceEditor.getSelection().getAllRanges();
      console.log("ace copy event  this.aceEditor.getCursorPosition() = ", this.aceEditor.getCursorPosition());
    });*/

    /*
    this.aceEditor.on("click", (ev)=>{
      
      x.forEach((el)=>{
        this.aceEditor.selection.addRange(el);
      })
      console.log("ace click event = ", ev)
      
    });
    */

    this.aceEditor.setFontSize(14);
    
    this.aceEditor.on("focus", (ev)=>{
      //if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.htmlCodePositionData.focus = true;
      //}
    })

    this.aceEditor.on("blur", (ev)=>{
      //if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.htmlCodePositionData.focus = false;
      //}
    })
    let self = this;

    this.aceEditor.addEventListener("keydown", (event: KeyboardEvent)=>{
      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
        this.mainService.canSaveCodeEditorsPostition = false;
        event.preventDefault();
        event.stopPropagation();

        //////console.log("self.runcodemsg.emit()");

        self.runcodemsg.emit();
      }
      else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        this.mainService.canSaveCodeEditorsPostition = false;
        event.preventDefault();
        event.stopPropagation();

        if( self.mainService.codeSavingDate === undefined || evDate.getTime() - self.mainService.codeSavingDate.getTime() >= 1500){
          //////console.log("self.savecodemsg.emit()");
          self.mainService.codeSavingDate = evDate;
          
          self.savecodemsg.emit();
        }
      }
    });

    //this.mainService.resumeFiddleTheme(this);
  }

  onCodeChanged(value) {
    //console.log('HTML onCodeChanged CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();

    /*
    console.log("this.canRetrievePositionsAfterLoad = ", this.canRetrievePositionsAfterLoad);
    if(this.canRetrievePositionsAfterLoad){
      console.log("called retrieveCodePartsCursors() from HtmlPartComponent !");
      this.mainService.retrieveCodePartsCursors(undefined, this);

      this.canRetrievePositionsAfterLoad = false; 
    }
    */
  }

}
