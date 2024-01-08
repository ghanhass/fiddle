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
    baseUrl: "/"
  };

  constructor(private mainService:MainService,
  private monacoLoaderService: MonacoEditorLoaderService) {
  }

  ngOnInit(): void {
    this.code = this.mainService.htmlCode;
  }

  onEditorLoad(editor: MonacoStandaloneCodeEditor){
    this.editor = editor;
    ////console.log("editor = ", this.editor);

    let self = this;

    this.monacoeditorloaded.emit();
    this.mainService.cssCodePositionData.focusSubject$.subscribe(()=>{
      this.mainService.cssCodePositionData.focus = true;
    });

    //console.log("editor = ", this.editor);
    //console.log("this.mainService.cssCodePositionData = ", this.mainService.cssCodePositionData);
    
    this.editor.onDidChangeCursorPosition((ev)=>{
    });

    this.editor.onDidFocusEditorText(()=>{
      this.mainService.cssCodePositionData.focus = true;
    });
    
    this.editor.onDidBlurEditorText(()=>{
      this.mainService.cssCodePositionData.focus = false;
    });

    this.editor.onKeyDown((event: monaco.IKeyboardEvent) => {
      //console.log("IKeyboardEvent keydown !");
      
      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){
        event.preventDefault();
        event.stopPropagation();

        ////console.log("self.runcodemsg.emit()");

        self.runcodemsg.emit();
      }
      else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        
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
        this.mainService.cssCodePositionData.column = this.editor.getPosition().column;
        this.mainService.cssCodePositionData.lineNumber = this.editor.getPosition().lineNumber; 
        ////console.log("onDidChangeCursorPosition: mainService.cssCodePositionData = ", this.mainService.cssCodePositionData);
    });
    this.mainService.resumeFiddleTheme();
  }

  onCodeChanged(value) {
    ////console.log('CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

}
