import { Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-css-part',
  templateUrl: './css-part.component.html',
  styleUrls: ['./css-part.component.css']
})
export class CssPartComponent implements OnInit {
  code: string = "";
  theme = 'vs-light';

  codeModel: any = {
    language: 'css',
    value: ""
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
