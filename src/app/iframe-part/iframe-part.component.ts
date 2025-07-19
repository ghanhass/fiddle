import { Component, ElementRef, OnInit,ViewChild, Output ,EventEmitter} from '@angular/core';
import { environment } from "../../environments/environment";
import { MainService } from '../main.service';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FiddleData } from '../fiddle-data';
import { CssPartComponent } from '../css-part/css-part.component';


@Component({
  selector: 'app-iframe-part',
  templateUrl: './iframe-part.component.html',
  styleUrls: ['./iframe-part.component.css']
})
export class IframePartComponent implements OnInit {

  //jsCode: string = "";
  //htmlCode: string = "";
  //cssCode: string = "";
  fiddleTitle: string = "";
  @ViewChild("form")form: ElementRef;
  @ViewChild("copyInput")copyInput: ElementRef;
  @ViewChild("iframe")iframeElement: ElementRef;
  @Output()showloader: EventEmitter<any> = new EventEmitter();
  @Output()hideloader: EventEmitter<any> = new EventEmitter();
  @Output()isConsoleOnUpdate: EventEmitter<boolean> = new EventEmitter();
  @Output()iframeload: EventEmitter<any> = new EventEmitter();
  cssPartComponent: CssPartComponent;
  
  url: string = environment.url;
  isIframeLoadComplete = true;
  isFiddleLoadComplete = true;
  isAfterViewInitReached = false;

  constructor(private mainService: MainService,
    private router:Router,
    private toastrService:ToastrService) {
      let self = this;
      window.addEventListener("message", function(event){
        if(event.data == "sub-iframe-loaded"){
          //console.log("message event from sub iframe = ", event);
          self.isIframeLoadComplete = true;
          if(self.isFiddleLoadComplete && self.isIframeLoadComplete){
            self.hideloader.emit();
            self.changeConsoleTheme();
            self.switchConsoleMobileMode();

          }
        }
        else if(event.data == "detected-error"){
          //console.log("message event from sub iframe = ", event);
          self.mainService.isConsoleOn = true;
          self.isConsoleOnUpdate.emit(true);
        }
      });
  }

  runFiddle(){
    this.isIframeLoadComplete = false;

    let data = {
      js:this.mainService.jsCode,
      css:this.mainService.cssCode,
      html:this.mainService.htmlCode,
      isConsoleOn: this.mainService.isConsoleOn
    }
    this.showloader.emit();
    if(this.iframeElement){
      let iframeElement = this.iframeElement.nativeElement as HTMLIFrameElement;
      //console.log("inside runFiddle() iframeElement.contentWindow = ", iframeElement.contentWindow);
      if(iframeElement.contentWindow){
        let fiddleCode = this.mainService.generateFiddleCode(data);
        let obj = {
          type:"run",
          html:fiddleCode,
          currentTheme: this.mainService.selectedTheme.data
        }
        iframeElement.contentWindow.postMessage(JSON.stringify(obj),environment.fiddleIframeOrigin); 
      }
    }
    else{
      //console.log("iframeElement is NOT DEFINED");
    }
  }

  saveFiddle(appMode){
    this.isFiddleLoadComplete = false;

    //console.log("saving Code");
    const self = this;
    let mobileCodePart = "0";
    let mobileResult = "1";

    if(!this.mainService.showResult){
      mobileResult = "0";
    }

    if(this.mainService.showHtml){
      mobileCodePart = "1";
    }
    else if(this.mainService.showCss){
      mobileCodePart = "2";
    }
    else if(this.mainService.showJs){
      mobileCodePart = "3";
    }

    let fiddleData : FiddleData = {
      js:this.mainService.jsCode,
      html:this.mainService.htmlCode,
      css:this.mainService.cssCode,
      pastebintext: this.mainService.pastebinText,
      
      js_part_size: this.mainService.jsCodePartSize,
      css_part_size: this.mainService.cssCodePartSize,
      html_part_size: this.mainService.htmlCodePartSize,

      code_parts_size: this.mainService.codePartsSize,

      main_container_width: this.mainService.mainContainerWidth,
      main_container_height: this.mainService.mainContainerHeight,

      title:this.mainService.fiddleTitle,
      layout:this.mainService.layout,
      mobile_layout: mobileCodePart+":"+mobileResult,
      iframe_resize_value: this.mainService.iframeResizeValue,
      css_code_position_data: this.mainService.cssCodePositionData,
      html_code_position_data: this.mainService.htmlCodePositionData,
      js_code_position_data: this.mainService.jsCodePositionData,
      is_mobile_mode: this.mainService.isMobileMode,
      created_at: new Date().getTime(),
      appmode: appMode
    }
    //console.log("this.mainService.showHtml = ", this.mainService.showHtml);
    //console.log("this.mainService.showCss = ", this.mainService.showCss);
    //console.log("this.mainService.showJs = ", this.mainService.showJs);
    //console.log("this.mainService.showResult = ", this.mainService.showResult);

    this.showloader.emit();

    this.mainService.saveFiddle(fiddleData).subscribe((fiddleId)=>{
      //console.log("saveFiddle fiddleId = ", fiddleId);

      //this.runFiddle();
      this.isFiddleLoadComplete = true;

      if(this.isFiddleLoadComplete && this.isIframeLoadComplete){
        this.hideloader.emit();
      }

      if(fiddleId > 0){
        if(this.copyInput.nativeElement){
          let input = this.copyInput.nativeElement
          let hrefValue = window.location.origin;
          if(hrefValue[hrefValue.length - 1] != "/"){
            hrefValue = hrefValue + "/";
          }
          input.value = hrefValue + (environment.appName ? (environment.appName + "/"):"") + fiddleId
          input.select();
          input.setSelectionRange(0, 99999);
          let copyCommand = document.execCommand("copy");
        }
        
        this.mainService.removeBeforeUnloadListener();
        this.mainService.resetCodeSinceSave();


        this.mainService.redirectAfterSaveMode = true;
        //console.log("gonna navigate now !");
        this.router.navigate(["/"+fiddleId]);
        this.toastrService.success("Fiddle URL copied to clipboard.");
      }
      else{
        this.toastrService.error("Error saving the fiddle!");
      }

    });
  }

  getIframeSrc(){
    return location.origin == "https://ghanhass.github.io" ? "https://ghanhass.github.io/myfiddlepreview/index.html" : "http://localhost/myfiddlepreview/index.html";
  }

  ngOnInit(): void {
  }
  
  ngAfterViewInit():void{
    this.isAfterViewInitReached = true;
  }

  onFormLoad(): void {
    //console.log("onFormLoad this.iframeElement = ",this.iframeElement);
    if(this.mainService.scheduledRunFiddle && this.iframeElement){
      this.mainService.scheduledRunFiddle = false;
      this.runFiddle();
    }
  }

  showConsole(){
    let iframeElement = this.iframeElement.nativeElement as HTMLIFrameElement;
    if(iframeElement.contentWindow){
      let obj = {
        type:"console-show",
        currentTheme: this.mainService.selectedTheme.data
      }
      iframeElement.contentWindow.postMessage(JSON.stringify(obj),environment.fiddleIframeOrigin); 
    }
  }

  switchConsoleMobileMode(){
    let isResponsiveModeOn = window.innerWidth <= 817 || window.innerHeight <= 580;
    let iframeElement = this.iframeElement.nativeElement as HTMLIFrameElement;
    if(iframeElement.contentWindow){
      let obj = {
        type:"console-mobile-update",
        isFiddleMobileMode: isResponsiveModeOn
      }
      iframeElement.contentWindow.postMessage(JSON.stringify(obj),environment.fiddleIframeOrigin); 
    }
  }

  changeConsoleTheme(){
    let iframeElement = this.iframeElement.nativeElement as HTMLIFrameElement;
    if(iframeElement.contentWindow){
      let obj = {
        type:"change-console-theme",
        currentTheme: this.mainService.selectedTheme.data
      }
      iframeElement.contentWindow.postMessage(JSON.stringify(obj),environment.fiddleIframeOrigin); 
    }
  }

  hideConsole(){
    let iframeElement = this.iframeElement.nativeElement as HTMLIFrameElement;
    if(iframeElement.contentWindow){
      let obj = {
        type:"console-hide",
      }
      iframeElement.contentWindow.postMessage(JSON.stringify(obj),environment.fiddleIframeOrigin); 
    }
  }

}