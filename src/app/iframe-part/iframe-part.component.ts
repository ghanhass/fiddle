import { Component, ElementRef, Input, OnInit, ViewChild,AfterViewInit, EventEmitter } from '@angular/core';
import { environment } from "../../environments/environment";
import { MainService } from '../main.service';
import { CommonService } from '../common.service';
import { LoaderComponent } from "../loader/loader.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-iframe-part',
  templateUrl: './iframe-part.component.html',
  styleUrls: ['./iframe-part.component.css']
})
export class IframePartComponent implements OnInit {

  jsCode: string = "";
  htmlCode: string = "";
  cssCode: string = "";
  @ViewChild("form")form: ElementRef;
  @ViewChild("loader")loader: LoaderComponent;
  @ViewChild("copyInput")copyInput: ElementRef;
  
  url: string = environment.url;
  isSaveMode: boolean = false;
  canSubmit: boolean = true;


  runCode(param?: any){
    this.jsCode = this.commonService.jsCode;
    this.cssCode = this.commonService.cssCode;
    this.htmlCode = this.commonService.htmlCode;

    this.loader.showLoader();
    if(param === "save"){
      this.isSaveMode = true;
    }
    if(this.canSubmit){
      this.form.nativeElement.submit();
      this.canSubmit = false;
    }
  }

  constructor(private mainService: MainService,
    private router:Router,
    private toastrService:ToastrService,
    private commonService:CommonService) { }

  ngOnInit(): void {
  }

  saveCode(){
    console.log("saving Code");
    const self = this;
    let data = {
      save: "1",
      js:this.commonService.jsCode,
      html:this.commonService.htmlCode,
      css:this.commonService.cssCode
    }
    this.mainService.saveFiddle(data).subscribe((res)=>{
      this.canSubmit = true;
      let obj = JSON.parse(res);
      if(obj.success == "1"){
        let fiddleId = obj.id;
        console.log("saved fiddle id = ", fiddleId);
        console.log("url = ", window.location.href);
        this.commonService.redirectMode = true;
        
        if(self.copyInput.nativeElement){
          let input = self.copyInput.nativeElement
          let hrefValue = window.location.origin;
          if(hrefValue[hrefValue.length - 1] != "/"){
            hrefValue = hrefValue + "/";
          }
          input.value = hrefValue + fiddleId
          input.select();
          input.setSelectionRange(0, 99999);
          console.log("copy result = ", document.execCommand("copy"));
        }
        self.router.navigate(["/"+fiddleId]);
        this.toastrService.success("Fiddle saved.", "Fiddle URL copied to clipboard.");
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