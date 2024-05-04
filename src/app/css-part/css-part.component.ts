import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { MainService } from "../main.service";
import { MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';
//import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
//import { IEvent, editor } from 'monaco-editor';


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
  canRetrievePositionsAfterLoad: boolean = false;

  editor: MonacoStandaloneCodeEditor;

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


  ngOnInit(): void {
    this.code = this.mainService.cssCode;
    //console.log("CssPartComponent ngOnInit");
  }

  onEditorLoad(editor: MonacoStandaloneCodeEditor){
    this.editor = editor;
    //console.log("CssPartComponent loaded editor  = ", this.editor);

    let self = this;

    this.mainService.retrieveCodePartsCursors(this);

    this.canRetrievePositionsAfterLoad = true;

    //console.log("editor = ", this.editor);

    this.editor.onDidFocusEditorText(()=>{
      //console.log("onDidFocusEditorText");
      if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.cssCodePositionData.focus = true;
      }
    });
    
    this.editor.onDidBlurEditorText(()=>{
      //console.log("onDidBlurEditorText");
      if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.cssCodePositionData.focus = false;
      }
    });

    this.editor.onKeyDown((event: monaco.IKeyboardEvent) => {
      //console.log("IKeyboardEvent keydown !");
      
      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
        this.mainService.canSaveCodeEditorsPostition = false;
        event.preventDefault();
        event.stopPropagation();

        ////console.log("self.runcodemsg.emit()");

        self.runcodemsg.emit();
      }
      else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        this.mainService.canSaveCodeEditorsPostition = false;
        event.preventDefault();
        event.stopPropagation();

        if( self.mainService.codeSavingDate === undefined || evDate.getTime() - self.mainService.codeSavingDate.getTime() >= 1500){
          ////console.log("self.savecodemsg.emit()");
          self.mainService.codeSavingDate = evDate;
          
          self.savecodemsg.emit();
        }
      }
    })
    
  }

  onCodeChanged(value) {
    ////console.log('CODE', value);
    this.mainService.cssCode = value;
    this.mainService.setCheckBeforeUnloadListener();

    if(this.canRetrievePositionsAfterLoad){
      this.mainService.retrieveCodePartsCursors(this);

      //console.log("called retrieveCodePartsCursors() from CssPartComponent !");

      this.canRetrievePositionsAfterLoad = false;
    }
  }


}
