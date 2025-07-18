import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { MainService } from "../main.service";
import { CodeEditor } from '@acrodata/code-editor';
import { languages } from '@codemirror/language-data';


@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  code: string = "";
  languages = languages;

  isFullScreenMode: boolean = false;
  @Output()toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output()runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

@ViewChild('codeMirrorEditor') codeMirrorEditor: any;
  //aceEditor: AceAjax.Editor;

  constructor(private mainService: MainService) { }


  ngOnInit(): void {
    this.code = this.mainService.cssCode;
  }

  onCodeChanged(value) {
    ////console.log('CODE', value);
    let self = this;
    console.log('HTML onCodeChanged CODE', value);
    this.mainService.cssCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

  onEditorKeyDown(event) {
    this.mainService.onEditorKeyDown(event, this);
  }

  onEditorKeyUp(event) {
    this.mainService.onEditorKeyUp(event, this);
  }


}
