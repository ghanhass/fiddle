import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css']
})
export class JsPartComponent implements OnInit {
  code: string = "";
  theme = 'vs-light';
  
  @Output() codeChange = new EventEmitter();

  codeModel: any = {
    language: 'javascript',
    value: '',
  };

  options = {
    contextmenu: false,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth:"1px",
    lineNumbersMinChars: 1,
    wordWrap:"on",
    baseUrl: "/"
  };
  constructor() { }

  onCodeChanged(value) {
    //console.log('CODE', value);
    this.codeChange.emit(value);
  }

  ngOnInit(): void {
  }
  
}
