import { Component, ElementRef, Input, OnInit, ViewChild,AfterViewInit, EventEmitter } from '@angular/core';
import { environment } from "src/environments/environment";
import { MainService } from '../main.service';

@Component({
  selector: 'app-iframe-part',
  templateUrl: './iframe-part.component.html',
  styleUrls: ['./iframe-part.component.css']
})
export class IframePartComponent implements OnInit {

  @Input()jsCode: string;
  @Input()htmlCode: string;
  @Input()cssCode: string;
  @ViewChild("form")form: ElementRef;
  url: string = environment.url;
  isSaveMode: boolean = false;
  canSave: EventEmitter<any> = new EventEmitter();

  runCode(param?: any){
    if(param === "save"){
      this.isSaveMode = true;
      this.saveCode();
    }
    else{
      this.form.nativeElement.submit();
    }
  }

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  saveCode(){
    console.log("saving Code");
    let data = {
      save: "1",
      js:this.jsCode,
      html:this.htmlCode,
      css:this.cssCode
    }
    this.mainService.saveCode(data).subscribe((res)=>{
      console.log("save code res = ", res);
    });
  }

  onFormLoad(): void {
    if(this.isSaveMode){
      //this.saveCode();
      this.isSaveMode = false;
    }
    else{
      console.log("iframe angular load event");
    }
  }

}