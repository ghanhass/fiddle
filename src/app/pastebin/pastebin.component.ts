import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import { AceEditorComponent } from 'ng2-ace-editor';
import { Ace } from 'ace-builds';

@Component({
  selector: 'app-pastebin',
  templateUrl: './pastebin.component.html',
  styleUrls: ['./pastebin.component.css']
})
export class PastebinComponent {
  theme: string = "cloud9_day"; 
  text: string = "";
  canRetrievePositionsAfterLoad: boolean;

  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();

  @ViewChild("aceeditor") aceeditor: AceEditorComponent;
  aceEditor: Ace.Editor;
  
  constructor(private mainService:MainService) {  }

  ngOnInit(): void {
    this.text = this.mainService.pastebinText;
    ////console.log("JsPartComponent ngOnInit");
  }

  ngAfterViewInit(){

    this.aceEditor = this.aceeditor.getEditor() ;
    this.aceEditor.setOptions({
      wrap: true
    });

    this.aceEditor.setFontSize(14);
    
    let self = this;

    this.aceEditor.addEventListener("keydown", (event: KeyboardEvent)=>{
      let evDate = new Date();

      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
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
    //////console.log('CODE', value);
    this.mainService.pastebinText = value;
    this.mainService.setCheckBeforeUnloadListener();
  }
}