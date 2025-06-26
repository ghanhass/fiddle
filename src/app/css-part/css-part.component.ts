import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";


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

  codeMirrorOptions: any = {
    mode: "css",
    lineNumbers: true, 
    theme: 'xq-light',
    spellcheck:true,
    autocorrect:true,
    lineWrapping: true
  }

  //@ViewChild(AceComponent, {static: false}) aceeditor: AceComponent;
  //aceEditor: AceAjax.Editor;

  constructor(private mainService: MainService) { }


  ngOnInit(): void {
    this.code = this.mainService.cssCode;
    console.log("CssPartComponent ngOnInit");
  }

  ngAfterViewInit(){}

  onCodeChanged(value) {
    ////console.log('CODE', value);
    let self = this;
    console.log('HTML onCodeChanged CODE', value);
    this.mainService.cssCode = value;
    this.mainService.setCheckBeforeUnloadListener();

  }


}
