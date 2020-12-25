import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
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

  @Input()jsCode: string = "";
  @Input()htmlCode: string = "";
  @Input()cssCode: string = "";
  @ViewChild("form")form: ElementRef;
  @ViewChild("loader")loader: LoaderComponent;
  @ViewChild("copyInput")copyInput: ElementRef;
  
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
        self.loader.showLoader();
        self.canSubmit = false;
        console.log("form's self.jsCode ", self.jsCode);
        console.log("form's self.cssCode ", self.cssCode);
        console.log("form's self.htmlCode ", self.htmlCode);
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
    console.log("saving Code");
    const self = this;
    let data = {
      save: "1",
      js:this.mainService.jsCode,
      html:this.mainService.htmlCode,
      css:this.mainService.cssCode
    }
    this.mainService.saveFiddle(data).subscribe((res)=>{
      this.canSubmit = true;
      let obj = JSON.parse(res);
      if(obj.success == "1"){
        let fiddleId = obj.id;
        console.log("saved fiddle id = ", fiddleId);
        console.log("url = ", window.location.href);
        
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
    });
  }

  onFormLoad(): void {
    if(this.isSaveMode){
      this.isSaveMode = false;
      this.saveCode();
    }
    else{
      this.canSubmit = true;
      console.log("iframe angular load event");
      this.loader.hideLoader();
    }
  }

}