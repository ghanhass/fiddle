import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
//import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-pastebin',
  templateUrl: './pastebin.component.html',
  styleUrls: ['./pastebin.component.css']
})
export class PastebinComponent {
  theme: string = "xq-light"; 
  text: string = "";
  canRetrievePositionsAfterLoad: boolean;

  @Output()savecodemsg: EventEmitter<string> = new EventEmitter();

  codeMirrorOptions: any = {
      mode: "htmlmixed",
      lineNumbers: true, 
      theme: 'xq-light',
      spellcheck:true,
      autocorrect:true
    }
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