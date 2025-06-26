import { Component, OnInit, Input, SimpleChanges, Output,EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import * as CodeMirror from 'codemirror/addon/dialog/dialog';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

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

  codeMirrorOptions: any = {
    mode: "htmlmixed",
    lineNumbers: true, 
    theme: 'xq-light',
    spellcheck:true,
    autocorrect:true,
    lineWrapping: true
  }
  @ViewChild("codeMirrorEditor") codeMirrorEditor: CodemirrorComponent;


  constructor(private mainService:MainService ) {
  }

  ngOnInit(): void {
    
    this.code = this.mainService.htmlCode;
    console.log("HtmlPartComponent ngOnInit");
    
  }

  ngAfterViewInit(){
    console.log("HtmlPartComponent ngAfterViewInit");
    console.log("this.codeMirrorEditor.ref.nativeElement = ", this.codeMirrorEditor.ref.nativeElement);
    }
    //this.mainService.resumeFiddleTheme(this);

  onCodeChanged(value) {
    let self = this;
    console.log('HTML onCodeChanged CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();
    
  }

}
