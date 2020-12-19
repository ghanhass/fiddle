import { Component, ElementRef, Input, OnInit, ViewChild,AfterViewInit, EventEmitter } from '@angular/core';
import { environment } from "../../environments/environment";
import { MainService } from '../main.service';
import { LoaderComponent } from "../loader/loader.component";

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
  @ViewChild("loader")loader: LoaderComponent;
  
  url: string = environment.url;
  isSaveMode: boolean = false;
  canSubmit: boolean = true;

  runCode(param?: any){
    this.loader.showLoader();
    if(param === "save"){
      this.isSaveMode = true;
    }
    if(this.canSubmit){
      this.form.nativeElement.submit();
      this.canSubmit = false;
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
      this.canSubmit = true;
      let obj = JSON.parse(res);
      if(obj.success == "1"){
        let fiddleId = obj.id;
        console.log("saved fiddle id = ", fiddleId);
        console.log("url = ", window.location.href);
      }
      this.loader.hideLoader();
    });
  }

  onFormLoad(): void {
    if(this.isSaveMode){
      this.saveCode();
      this.isSaveMode = false;
    }
    else{
      this.canSubmit = true;
      console.log("iframe angular load event");
      this.loader.hideLoader();
    }
  }

}