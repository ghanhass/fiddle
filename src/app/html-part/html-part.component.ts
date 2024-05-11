import { Component, OnInit, Input, SimpleChanges, Output,EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import {
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
  canRetrievePositionsAfterLoad: boolean = false;

  editor: MonacoStandaloneCodeEditor;

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
    this.code = this.mainService.htmlCode;
    //console.log("HtmlPartComponent ngOnInit");
  }

  onEditorLoad(editor: MonacoStandaloneCodeEditor){
    this.editor = editor;
    //console.log("HtmlPartComponent loaded editor  = ", this.editor);

    let self = this;

    this.monacoeditorloaded.emit();
    this.mainService.retrieveCodePartsCursors(undefined, this);

    this.canRetrievePositionsAfterLoad = true;

    ////console.log("editor = ", this.editor);
    ////console.log("this.mainService.htmlCodePositionData = ", this.mainService.htmlCodePositionData);

    this.editor.onDidFocusEditorText(()=>{
      ////console.log("onDidFocusEditorText");
      if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.htmlCodePositionData.focus = true;
      }
    });
    
    this.editor.onDidBlurEditorText(()=>{
      ////console.log("onDidBlurEditorText");
      if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.htmlCodePositionData.focus = false;
      }
    });

    this.editor.onKeyDown((event: monaco.IKeyboardEvent) => {
      ////console.log("IKeyboardEvent keydown !");
      
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
    })

    this.mainService.resumeFiddleTheme();
  }

  onCodeChanged(value) {
    //////console.log('CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();

    if(this.canRetrievePositionsAfterLoad){
      this.mainService.retrieveCodePartsCursors(undefined, this);

      //console.log("called retrieveCodePartsCursors() from HtmlPartComponent !");

      this.canRetrievePositionsAfterLoad = false; 
    }
  }

}
