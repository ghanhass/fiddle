import {
  Component,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
  Input,
  ViewChild,
} from '@angular/core';
import { MainService } from '../main.service';
import { languages } from '@codemirror/language-data';
import { CodeEditor } from '@acrodata/code-editor';
import { FormsModule } from '@angular/forms';
//import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  standalone: true,
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css'],
  imports: [CodeEditor, FormsModule]
})
export class JsPartComponent implements OnInit {
  code: string = '';
  languages = languages;

  isFullScreenMode: boolean = false;
  @Output() toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output() runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output() savecodemsg: EventEmitter<string> = new EventEmitter();

  @ViewChild('codeMirrorEditor') codeMirrorEditor: any;

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.code = this.mainService.jsCode;
    console.log('JsPartComponent ngOnInit');
  }

  ngAfterViewInit() {
    console.log('JsPartComponent ngAfterViewInit');
  }

  onCodeChanged(value: string) {
    //////console.log('CODE', value);
    let self = this;
    this.mainService.jsCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

  onEditorKeyDown(event: any) {
    this.mainService.onEditorKeyDown(event, this);
  }

  onEditorKeyUp(event: any) {
    this.mainService.onEditorKeyUp(event, this);
  }
}
