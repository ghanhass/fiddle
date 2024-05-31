import { Component, OnInit, SimpleChanges, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import { MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';
import { AceEditorComponent } from 'ng2-ace-editor';
import { Ace } from 'ace-builds';

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css']
})
export class JsPartComponent implements OnInit {
  code: string = "";
  theme: string = "cloud9_day";
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

  editor:MonacoStandaloneCodeEditor;
  @ViewChild("aceeditor") aceeditor: AceEditorComponent;
  aceEditor: Ace.Editor;

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

  ngOnInit(): void {
    this.canRetrievePositionsAfterLoad = true;
    this.code = this.mainService.jsCode;
    ////console.log("JsPartComponent ngOnInit");
  }

  ngAfterViewInit(){
    console.log("JsPartComponent ngAfterViewInit");

    this.aceEditor = this.aceeditor.getEditor() ;
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      wrap: true
    });

    this.mainService.retrieveCodePartsCursors(undefined, undefined, this);

    this.aceEditor.setFontSize(14);
    
    this.aceEditor.on("focus", (ev)=>{
      this.mainService.htmlCodePositionData.focus = false;
      this.mainService.cssCodePositionData.focus = false;
      this.mainService.jsCodePositionData.focus = true;
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
    //////console.log('CODE', value);
    let self = this;
    this.mainService.jsCode = value;
    this.mainService.setCheckBeforeUnloadListener();

    if(this.canRetrievePositionsAfterLoad){
      setTimeout(()=>{
        console.log("called retrieveCodePartsCursors() from HtmlPartComponent !");
        self.mainService.retrieveCodePartsCursors(undefined, undefined, self);

        self.canRetrievePositionsAfterLoad = false; 
      }, 1);
    }
  }

}
