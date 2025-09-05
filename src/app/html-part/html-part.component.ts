import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MainService } from '../main.service';
import { CodeEditor } from '@acrodata/code-editor';
import { languages } from '@codemirror/language-data';
import { FormsModule } from '@angular/forms';

@Component({
  standalone:true,
  selector: 'app-html-part',
  templateUrl: './html-part.component.html',
  styleUrls: ['./html-part.component.css'],
  imports: [CodeEditor, FormsModule]
  
})
export class HtmlPartComponent implements OnInit {
  code: string = '';
  languages = languages;

  isFullScreenMode: boolean = false;
  @Output() toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output() runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output() savecodemsg: EventEmitter<string> = new EventEmitter();

  @ViewChild('codeMirrorEditor') codeMirrorEditor: CodeEditor = new CodeEditor(new ElementRef(document.createElement("div")));

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.code = this.mainService.htmlCode;
  }

  onCodeChanged(value: string) {
    let self = this;
    //console.log('HTML onCodeChanged CODE', value);
    this.mainService.htmlCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

  onEditorKeyDown(event: any) {
    this.mainService.onEditorKeyDown(event, this);
  }

  onEditorKeyUp(event: any) {
    this.mainService.onEditorKeyUp(event, this);
  }
}
