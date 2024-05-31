import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import { AceEditorComponent } from 'ng2-ace-editor';
import { Ace } from 'ace-builds';


@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  code: string = "";

  theme: string = "cloud9_day";

  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

  @ViewChild("aceeditor") aceeditor: AceEditorComponent;
  aceEditor: Ace.Editor;

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
    this.canRetrievePositionsAfterLoad = true;
    this.code = this.mainService.cssCode;
    //console.log("CssPartComponent ngOnInit");
  }

  ngAfterViewInit(){
    this.aceEditor = this.aceeditor.getEditor() ;
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      wrap: true
    });

    this.mainService.retrieveCodePartsCursors(this);

    this.aceEditor.setFontSize(14);
    
    this.aceEditor.on("focus", (ev)=>{
        this.mainService.htmlCodePositionData.focus = false;
        this.mainService.cssCodePositionData.focus = true;
        this.mainService.jsCodePositionData.focus = false;
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
  }

  onCodeChanged(value) {
    ////console.log('CODE', value);
    let self = this;
    this.mainService.cssCode = value;
    this.mainService.setCheckBeforeUnloadListener();

    if(this.canRetrievePositionsAfterLoad){
      setTimeout(()=>{
        console.log("called retrieveCodePartsCursors() from CssPartComponent !");
        self.mainService.retrieveCodePartsCursors(self);

        self.canRetrievePositionsAfterLoad = false; 
      }, 1);
    }
  }


}
