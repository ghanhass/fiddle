import { Component, OnInit, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { MainService } from "../main.service";
import { MonacoStandaloneCodeEditor } from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css']
})
export class JsPartComponent implements OnInit {
  code: string = "";
  theme = 'vs-light';
  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();

  editor:MonacoStandaloneCodeEditor;

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
    ////console.log('CODE', value);
    this.mainService.jsCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

  ngOnInit(): void {
    this.code = this.mainService.jsCode;
  }

  onEditorLoad(editor: MonacoStandaloneCodeEditor){
    this.editor = editor;
    let self = this;
    ////console.log("editor = ", this.editor);

    //console.log("editor = ", this.editor);
    //console.log("this.mainService.cssCodePositionData = ", this.mainService.cssCodePositionData);

    this.mainService.retrieveCodePartsCursors(undefined, undefined, this);

    this.editor.onDidFocusEditorText(()=>{
      if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.jsCodePositionData.focus = true;
      }
    });
    
    this.editor.onDidBlurEditorText(()=>{
      if(this.mainService.canSaveCodeEditorsPostition){
        this.mainService.jsCodePositionData.focus = false;
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

    this.editor.onDidChangeCursorPosition(() => {
        this.mainService.jsCodePositionData.column = this.editor.getPosition().column;
        this.mainService.jsCodePositionData.lineNumber = this.editor.getPosition().lineNumber; 
        ////console.log("onDidChangeCursorPosition: mainService.cssCodePositionData = ", this.mainService.cssCodePositionData);
    });
  }

}
