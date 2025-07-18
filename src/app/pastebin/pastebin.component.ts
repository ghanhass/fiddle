import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import { languages } from '@codemirror/language-data';
//import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-pastebin',
  templateUrl: './pastebin.component.html',
  styleUrls: ['./pastebin.component.css']
})
export class PastebinComponent {
  text: string = "";
  languages = languages;

  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();
  @ViewChild("codeMirrorEditor") codeMirrorEditor: any;
  
  constructor(private mainService:MainService) {  }

  ngOnInit(): void {
    this.text = this.mainService.pastebinText;
    ////console.log("JsPartComponent ngOnInit");
  }

  ngAfterViewInit(){

  }

  onCodeChanged(value) {
    //////console.log('CODE', value);
    this.mainService.pastebinText = value;
    this.mainService.setCheckBeforeUnloadListener();
  }
}