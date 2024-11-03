import { Component, OnInit, Input, SimpleChanges, Output,EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
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
  canRetrievePositionsAfterLoad: boolean = false;

 @ViewChild("aceeditor") aceeditor: AceEditorComponent;
 aceEditor: Ace.Editor;

  constructor(private mainService:MainService ) {
  }

  ngOnInit(): void {
    
    this.code = this.mainService.htmlCode;
    console.log("HtmlPartComponent ngOnInit");
  }

  ngAfterViewInit(){
    console.log("HtmlPartComponent ngAfterViewInit");
    this.aceEditor = this.aceeditor.getEditor() ;
    this.aceEditor.on("changeSession", (e)=>{console.log("html aceEditor changeSession ev = ", e)});
    
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      wrap: true
    });
    

    this.aceEditor.setFontSize(14);
    
    this.aceEditor.on("focus", (ev)=>{
      this.mainService.htmlCodePositionData.focus = true;
      this.mainService.cssCodePositionData.focus = false;
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

    //this.mainService.resumeFiddleTheme(this);
  }

  onCodeChanged(value) {
    let self = this;
    console.log('HTML onCodeChanged CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();

    
    console.log("this.canRetrievePositionsAfterLoad = ", this.canRetrievePositionsAfterLoad);
    if(this.canRetrievePositionsAfterLoad){
      self.canRetrievePositionsAfterLoad = false; 

      setTimeout(()=>{
        console.log("called retrieveCodePartsCursors() from HtmlPartComponent !");
        self.mainService.retrieveCodePartsCursors(undefined, self);
      }, 1);
    }
    
  }

}
