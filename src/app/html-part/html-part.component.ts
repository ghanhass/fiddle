import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { MainService } from '../main.service';
import { CodeEditor } from '@acrodata/code-editor';
//import * as CodeMirror from 'codemirror/addon/dialog/dialog';
//import { Editor } from 'codemirror';
import { languages } from '@codemirror/language-data';

@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css'],
})
export class HtmlPartComponent implements OnInit {
  code: string = '';
  theme: string = 'xq-light';
  languages = languages;

  isFullScreenMode: boolean = false;
  @Output() toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output() runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output() savecodemsg: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

  codeMirrorOptions: any = {
    mode: 'htmlmixed',
    lineNumbers: true,
    theme: 'xq-light',
    spellcheck: true,
    autocorrect: true,
    lineWrapping: true,
    autofocus: true,

    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
  };
  @ViewChild('codeMirrorEditor') codeMirrorEditor: CodeEditor;

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.code = this.mainService.htmlCode;
  }

  /*onCodeMirrorLoaded(comp: CodemirrorComponent){
     //console.log("this.codeMirrorEditor = ", this.codeMirrorEditor);
     setTimeout(()=>{
      this.codeMirrorEditor.codeMirror.focus();
      this.codeMirrorEditor.ref.nativeElement.click();
     },1);
     console.log("this.codeMirrorEditor.isFocused; = ", this.codeMirrorEditor.isFocused);
  }*/

  ngAfterViewInit() {
    //sconsole.log("HtmlPartComponent ngAfterViewInit");
    //console.log("this.codeMirrorEditor = ", this.codeMirrorEditor);
  }
  //this.mainService.resumeFiddleTheme(this);

  onCodeChanged(value) {
    let self = this;
    //console.log('HTML onCodeChanged CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

  onEditorKeyDown(event) {
    this.mainService.onEditorKeyDown(event, this);
  }

  onEditorKeyUp(event) {
    this.mainService.onEditorKeyUp(event, this);
  }
}
