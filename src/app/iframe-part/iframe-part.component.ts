import { Component, ElementRef, OnInit, ViewChild, Input, HostListener, Output ,EventEmitter} from '@angular/core';
import { environment } from "../../environments/environment";
import { MainService } from '../main.service';
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
  fiddleTitle: string = "";
  @ViewChild("form")form: ElementRef;
  @ViewChild("loader")loader: LoaderComponent;
  @ViewChild("copyInput")copyInput: ElementRef;
  @Output()showloader: EventEmitter<any> = new EventEmitter();
  @Output()hideloader: EventEmitter<any> = new EventEmitter();
  @Output()iframeload: EventEmitter<any> = new EventEmitter();
  
  url: string = environment.url;
  isSaveMode: boolean = false;
  canSubmit: boolean = true;


  runCode(param?: any){
    this.jsCode = this.mainService.jsCode;
    this.htmlCode = this.mainService.htmlCode;
    this.cssCode = this.mainService.cssCode;

    if(param === "save"){
      this.isSaveMode = true;
    }
    if(this.canSubmit){
      let self = this;
      window.setTimeout(()=>{
        //self.loader.showLoader();
        self.showloader.emit();
        self.canSubmit = false;
        //console.log("form's self.jsCode ", self.jsCode);
        //console.log("form's self.cssCode ", self.cssCode);
        //console.log("form's self.htmlCode ", self.htmlCode);
        self.form.nativeElement.submit();
      },1)
      
    }
  }

  constructor(private mainService: MainService,
    private router:Router,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
  }


  saveCode(){
    //console.log("saving Code");
    const self = this;
    let data = {
      save: "1",
      js:this.mainService.jsCode,
      html:this.mainService.htmlCode,
      css:this.mainService.cssCode,
      
      jsCodePartSize: this.mainService.jsCodePartSize,
      cssCodePartSize: this.mainService.cssCodePartSize,
      htmlCodePartSize: this.mainService.htmlCodePartSize,

      codePartsSize: this.mainService.codePartsSize,

      mainContainerWidth: this.mainService.mainContainerWidth,
      mainContainerHeight: this.mainService.mainContainerHeight,

      title:this.mainService.fiddleTitle,
      layout:this.mainService.layout
    }
    this.mainService.saveFiddle(data).subscribe((res)=>{
      this.canSubmit = true;
      let obj = JSON.parse(res);
      if(obj.success == "1"){
        let fiddleId = obj.id;
        //console.log("saved fiddle id = ", fiddleId);
        //console.log("url = ", window.location.href);
        
        if(self.copyInput.nativeElement){
          let input = self.copyInput.nativeElement
          let hrefValue = window.location.origin;
          if(hrefValue[hrefValue.length - 1] != "/"){
            hrefValue = hrefValue + "/";
          }
          input.value = hrefValue + (environment.appName ? (environment.appName + "/"):"") + fiddleId
          input.select();
          input.setSelectionRange(0, 99999);
          let copyCommand = document.execCommand("copy");
        }
        self.mainService.redirectAfterSaveMode = true;
        self.router.navigate(["/"+fiddleId]);
        this.toastrService.success("Fiddle URL copied to clipboard.");
      }
    });
  }

  onFormLoad(): void {
    if(this.isSaveMode){
      this.isSaveMode = false;
      this.saveCode();
    }
    else{
      this.canSubmit = true;
      //console.log("iframe angular load event");
      this.loader.hideLoader();
      this.hideloader.emit();
    }
  }

}