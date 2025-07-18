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
import { languages } from '@codemirror/language-data';

@Component({
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css'],
})
export class HtmlPartComponent implements OnInit {
  code: string = '';
  languages = languages;

  isFullScreenMode: boolean = false;
  @Output() toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output() runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output() savecodemsg: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

  @ViewChild('codeMirrorEditor') codeMirrorEditor: CodeEditor;

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.code = this.mainService.htmlCode;
  }

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
