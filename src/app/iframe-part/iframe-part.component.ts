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
  //@ViewChild("saveCb")saveCb: ElementRef;
  url: string = environment.url;
  isSaveMode: boolean = false;
  canSave: EventEmitter<any> = new EventEmitter();

  runCode(param?: any){
    if(param === "save"){
      this.isSaveMode = true;
    }
    this.form.nativeElement.submit();
  }
  /*saveCode(){
    this.saveCb.nativeElement.checked = true;
    this.form.nativeElement.submit();
    this.saveCb.nativeElement.checked = false;
  }*/

  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  onFormLoad(): void {
    if(this.isSaveMode){
      console.log("isSaveMode == true && iframe angular load event");
      console.log("saving Code");
      this.mainService.saveCode().subscribe((res)=>{
        console.log("save code res = ", res);
      });
      this.isSaveMode = false;
    }
    else{
      console.log("iframe angular load event");
    }
  }

}