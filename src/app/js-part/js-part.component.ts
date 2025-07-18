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
//import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-js-part',
  templateUrl: './js-part.component.html',
  styleUrls: ['./js-part.component.css'],
})
export class JsPartComponent implements OnInit {
  code: string = '';
  languages = languages;

  isFullScreenMode: boolean = false;
  @Output() toggleFullScreen: EventEmitter<string> = new EventEmitter();
  @Output() runcodemsg: EventEmitter<string> = new EventEmitter();
  @Output() savecodemsg: EventEmitter<string> = new EventEmitter();
  canRetrievePositionsAfterLoad: boolean = false;

  @ViewChild('codeMirrorEditor') codeMirrorEditor: any;

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    this.code = this.mainService.jsCode;
    console.log('JsPartComponent ngOnInit');
  }

  ngAfterViewInit() {
    console.log('JsPartComponent ngAfterViewInit');
  }

  onCodeChanged(value) {
    //////console.log('CODE', value);
    let self = this;
    this.mainService.jsCode = value;
    this.mainService.setCheckBeforeUnloadListener();
  }

  onEditorKeyDown(event) {
    this.mainService.onEditorKeyDown(event, this);
  }

  onEditorKeyUp(event) {
    this.mainService.onEditorKeyUp(event, this);
  }
}
