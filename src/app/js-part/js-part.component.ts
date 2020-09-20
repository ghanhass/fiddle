import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css']
})
export class JsPartComponent implements OnInit {

  code: string = "";
  theme = 'vs-light';

  codeModel: any = {
    language: 'javascript',
    value: '',
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: false,
    },
    lineDecorationsWidth:"1px",
    lineNumbersMinChars: 1,
    wordWrap:"on"
  };
  constructor() { }


  onCodeChanged(value) {
    console.log('CODE', value);
  }
  ngOnInit(): void {
  }
  
}
