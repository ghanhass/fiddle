import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css']
})
export class HtmlPartComponent implements OnInit {
  code: string = "";
  theme = 'vs-light';

  @Output() codeChange = new EventEmitter();
  codeModel: any = {
    language: 'html',
    //uri: 'main.json',
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
