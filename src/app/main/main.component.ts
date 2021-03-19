import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MainService } from "../main.service";
import { IframePartComponent } from "../iframe-part/iframe-part.component";
import { ActivatedRoute } from "@angular/router";
import { ModalComponent } from '../modal/modal.component';
import { SplitComponent } from "angular-split";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

  showHtml: boolean = false;
  showCss: boolean = true;
  showJs: boolean = false;
  showResult: boolean = true;
  showIframeHider: boolean = false;
  
  isHtmlFullScreen: boolean = false;
  isCssFullScreen: boolean = false;
  isJsFullScreen: boolean = false;
  
  mainResizerLeft: string = "425px";
  mainResizerRight: string = "auto";
  codePartsWidth: string = "425px";
  verticalResizeMode:boolean = false;
  
  cssVerticalResizeMode:boolean = false;
  jsVerticalResizeMode:boolean = false;

  htmlPartHeight:number = 0;
  cssPartHeight:number = 0;
  jsPartHeight:number = 0;

  codePartsOffsetHeight: number = 0;

  htmlPartTop: number = 0;
  cssPartTop:number = 0;
  jsPartTop:number = 0;
  
  cssMousedownY: number = 0;
  jsMousedownY: number = 0;
  mainResizerMousedownX: number = 0;
  mainResizerMousedownY: number = 0;

  mainResizeMode:boolean = false;
  verticalResizeType:string = "";
  customInterval: any;

  @ViewChild("splitComponentInner") splitComponentInner: SplitComponent;

  @ViewChild("mainResizer") mainResizer:ElementRef;
  @ViewChild("mainResizerFloor") mainResizerFloor:ElementRef;

  @ViewChild("mainContainer") mainContainer:ElementRef;
  @ViewChild("codeParts") codeParts:ElementRef;
  @ViewChild("htmlPart") htmlPart:ElementRef;
  @ViewChild("cssPart") cssPart:ElementRef;
  @ViewChild("jsPart") jsPart:ElementRef;


  @ViewChild("iframePart") iframePart:IframePartComponent;
  @ViewChild("layout1") layout1: ElementRef;
  @ViewChild("layout2") layout2: ElementRef;
  @ViewChild("layout3") layout3: ElementRef;
  @ViewChild("layoutsList") layoutsList: ElementRef;

  @ViewChild("modal") modal: ModalComponent;

  cssCodePartTitle: HTMLElement;
  jsCodePartTitle: HTMLElement;

  jsCode: string = "";
  cssCode: string = "";
  htmlCode: string = "";
  isLayoutsListShown: boolean = false;
  layout: number = 1;

  windowWidth: number;
  windowHeight: number;

  constructor(private mainService: MainService,
    private activatedRoute: ActivatedRoute) { 
  }

  ngAfterViewInit(): void {
    let self = this;
     
    this.activatedRoute.paramMap.subscribe((params)=>{
      let currentFiddleId = +params.get("id");
      if(currentFiddleId){
        if(self.mainService.redirectMode){
          this.htmlCode = this.mainService.htmlCode;
          this.cssCode = this.mainService.cssCode;
          this.jsCode = this.mainService.jsCode;
          self.mainService.redirectMode = false;
          this.runCode();
        }
        else{
          let data = {
            get: "1",
            fiddleId: currentFiddleId
          }
          self.mainService.getFiddle(data).subscribe((res)=>{
            //console.log("getFiddle res = ", res);
            let obj = JSON.parse(res);
            if(obj.success === "1"){
              //console.log("getFiddle obj = ", obj);
              this.htmlCode = obj.html;
              this.cssCode = obj.css;
              this.jsCode = obj.js;
              this.mainService.jsCode = obj.js;
              this.mainService.htmlCode = obj.html;
              this.mainService.cssCode = obj.css;
              this.runCode();
            }
          });
        }
      }
    });
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    this.codePartsOffsetHeight = codePartsEl.offsetHeight;
    this.splitComponentInner.dragProgress$.subscribe((res)=>{
      console.log("dragProgress$ res = ", res);
    })
    //console.log("codePartsOffsetHeight = ", this.codePartsOffsetHeight);
    window.setTimeout(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 1);
  }


  changeLayout(newLayout: number){
    if(newLayout != this.layout){
      this.layout = newLayout;
      let mainResizerEl: HTMLElement = this.mainResizer.nativeElement;
      let codePartsEl: HTMLElement = this.codeParts.nativeElement;
      if(mainResizerEl && codePartsEl){
        switch(this.layout){
          case 1:
          break;
          case 2:
          break;
          case 3:
          break;
          case 4:
        }
      }
      window.setTimeout(()=>{
        window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
      }, 1);
    }
  }

  getLayoutInfos(name){
    switch(this.layout){
      case 1:
      switch(name){
        case "outerAsSplitDirection":
        return "horizontal";
        
        case "outerAsSplitUnit":
        return "pixel";

        case "codePartsAsSplitAreaOrder":
        return 1;

        case "codePartsAsSplitAreaMinSize":
        return 350;

        case "codePartsAsSplitAreaSize":
        return 350;

        case "innerAsSplitDirection":
        return 'vertical';

        case "innerAsSplitUnit":
        return 'pixel';

        case "emptyAsSplitAreaMinSize":
        return 10;

        case "emptyAsSplitAreaSize":
        return 10;

        case "emptyAsSplitAreaMaxSize":
        return 10;

        case "htmlAsSplitAreaMinSize":
        return 25;

        case "htmlAsSplitAreaSize":
        return (this.codePartsOffsetHeight - 20) / 3;

        case "cssAsSplitAreaSize":
        return (this.codePartsOffsetHeight - 20) / 3;

        case "cssAsSplitAreaMinSize":
        return 25;

        case "jsAsSplitAreaSize":
        return (this.codePartsOffsetHeight - 20) / 3;

        case "jsAsSplitAreaMinSize":
        return 25;

        case "iframeAsSplitAreaOrder":
        return 2;

        case "iframeAsSplitAreaMinSize":
        return 350;

        case "iframeAsSplitAreaSize":
        return "*";
      }
      break;

      case 2:
      break;

      case 3:
      switch(name){
        case "outerAsSplitDirection":
        return "horizontal";
        
        case "outerAsSplitUnit":
        return "pixel";

        case "codePartsAsSplitAreaOrder":
        return 2;

        case "codePartsAsSplitAreaMinSize":
        return 350;

        case "codePartsAsSplitAreaSize":
        return 350;

        case "innerAsSplitDirection":
        return 'vertical';

        case "innerAsSplitUnit":
        return 'pixel';

        case "emptyAsSplitAreaMinSize":
        return 10;

        case "emptyAsSplitAreaSize":
        return 10;

        case "emptyAsSplitAreaMaxSize":
        return 10;

        case "htmlAsSplitAreaMinSize":
        return 25;

        case "htmlAsSplitAreaSize":
        return (this.codePartsOffsetHeight - 20) / 3;

        case "cssAsSplitAreaSize":
        return (this.codePartsOffsetHeight - 20) / 3;

        case "cssAsSplitAreaMinSize":
        return 25;

        case "jsAsSplitAreaSize":
        return (this.codePartsOffsetHeight - 20) / 3;

        case "jsAsSplitAreaMinSize":
        return 25;

        case "iframeAsSplitAreaOrder":
        return 1;

        case "iframeAsSplitAreaMinSize":
        return 350;

        case "iframeAsSplitAreaSize":
        return "*";
      }
      break;

      case 4:
    }
  }

  toggleLayoutsList(resizeMode?: boolean){
    if(window.innerWidth > 767 && window.innerHeight > 580){
      let layout1Element: HTMLElement = this.layout1.nativeElement;
      if(layout1Element){
        let layout1Height = layout1Element.offsetHeight;
        let layoutsListElement: HTMLElement = this.layoutsList.nativeElement;
        if(layoutsListElement){
          if(!resizeMode){
            this.isLayoutsListShown = !this.isLayoutsListShown;
          }
          if(this.isLayoutsListShown){
            if(window.innerWidth > 550){
              layoutsListElement.style.height = layout1Height + "px";
            }
            else{
              layoutsListElement.style.height = (layout1Height * 2)+ 15 + "px";
            }
          }
          else{
            layoutsListElement.style.height = "";
          }
        }

        //console.log("layout1Element.offsetHeight = ", layout1Element.offsetHeight)
      }
    }
  }

  toggleFullScreenMode(mode: string){
    switch(mode){
      case 'html':
      this.isHtmlFullScreen = !this.isHtmlFullScreen;
      break;

      case 'css':
      this.isCssFullScreen = !this.isCssFullScreen;
      break;

      case 'js':
      this.isJsFullScreen = !this.isJsFullScreen;
      break;
    }
    let editorLayoutFixInterval = window.setTimeout(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 1);
  }

  resetResizersAppearance(){
    this.mainResizerFloor.nativeElement.classList.add("hide");
    this.mainResizerFloor.nativeElement.classList.remove("resize-mode");
  }


  @HostListener("window:resize", ["$event"])
  onWindowResize(event){
    //console.log("/!\ window resize event: ", event);
    this.toggleLayoutsList(true);
    
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    if(codePartsEl){
      this.codePartsOffsetHeight = codePartsEl.offsetHeight;
    }
  }

  @HostListener("window:click", ["$event"])
  onWindowClick(event){
    //console.log("click event.target = ", event.target);
  }

  runCode(param?){
    this.iframePart.runCode(param);
  }

  isMobileMode(){
    return (window.innerWidth < 768 || window.innerHeight < 581);
  }

  getCodePartsHeight(){
    if(this.isMobileMode){
      return !this.showResult ? '100%':'';
    }
    else{
      if(this.layout == 1 || this.layout == 3){
        return "";
      }
    }
  }

  getCodePartsWidth(){
    if(this.layout == 1 || this.layout == 3){
      return this.codePartsWidth;
    }
  } 

  toggleCodePart(codeType: string): void{
    switch(codeType){
      case "html":
      this.showHtml = !this.showHtml;
      this.showCss = false;
      this.showJs = false;
      if(!this.showHtml){
        this.showResult = true;
      }
      break;
      case "css":
      this.showCss = !this.showCss;
      this.showHtml = false;
      this.showJs = false;
      if(!this.showCss){
        this.showResult = true;
      }
      break;
      case "js":
      this.showJs = !this.showJs;
      this.showHtml = false;
      this.showCss = false;
      if(!this.showJs){
        this.showResult = true;
      }
      break;
      case "result":
      if(this.showJs || this.showHtml || this.showCss ){
        this.showResult = !this.showResult;
      }
      break;
    }
    let self = this;
    let editorLayoutFixInterval = window.setInterval(()=>{
      //console.log("inside custom interval");
      if (!this.showCss){
        if(this.codeParts.nativeElement.querySelector(".code-component-container-css").classList.contains("hide-mobile")){
          window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showHtml){
        if(this.codeParts.nativeElement.querySelector(".code-component-container-html").classList.contains("hide-mobile")){
          window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showJs){
        if(this.codeParts.nativeElement.querySelector(".code-component-container-js").classList.contains("hide-mobile")){
          window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showResult){
        if(document.querySelector("app-iframe-part").classList.contains("hide-mobile")){
          window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          clearInterval(editorLayoutFixInterval);
        }
      }
    }, 50);
  }
  
  codePartsTitleMousedown(event: MouseEvent, mode){
    //console.log("codePartsTitleMousedown event = ", event);
    //console.log("codePartsTitleMousedown mode = ", mode)
    if(this.layout == 1 || this.layout == 3){
      switch(mode){
        case "css":
        this.cssCodePartTitle = <HTMLElement>event.target;
        this.cssMousedownY = event.clientY;
        this.cssVerticalResizeMode = true;
        this.triggerResizeWithInterval(150);
        break;
  
        case "js":
        this.jsCodePartTitle = <HTMLElement>event.target;
        this.jsMousedownY = event.clientY;
        this.jsVerticalResizeMode = true;
        this.triggerResizeWithInterval(150);
        break;
      }
    }
  }

  codePartsMousemove(event: MouseEvent){
    //event.stopPropagation();
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    let cssCodePart:HTMLElement = this.cssPart.nativeElement;
    let jsCodePart:HTMLElement = this.jsPart.nativeElement;
    let htmlCodePart:HTMLElement = this.htmlPart.nativeElement;
    let codePartsHeight = codePartsEl.offsetHeight;

    this.cssCodePartTitle = this.cssCodePartTitle ? this.cssCodePartTitle : (cssCodePart.firstElementChild as HTMLElement);
    this.jsCodePartTitle = this.jsCodePartTitle ? this.jsCodePartTitle : (jsCodePart.firstElementChild as HTMLElement);

    if(this.layout == 1 || this.layout == 3){//vertical layout ?
      if(this.cssVerticalResizeMode){//css resizing ?

        let newCssPartTop = this.cssPartTop + (event.clientY - this.cssMousedownY);
        if(newCssPartTop <= (codePartsHeight - 64) && newCssPartTop > 32){//within valid range ?
          cssCodePart.style.top = newCssPartTop + "px";

          if(this.jsPartTop - 32 <= newCssPartTop){//Css titleBar eached Js titleBar ?
            this.jsPartTop = newCssPartTop + 32;
            jsCodePart.style.top = this.jsPartTop + "px"
          }
        }
        else if(newCssPartTop <= 32){//upper limit reached ?
          cssCodePart.style.top = "32px";
        }
        else if (newCssPartTop >= codePartsHeight- 64){//lower limit reached ?
          cssCodePart.style.top = codePartsHeight- 64 + "px";
          this.jsPartTop = codePartsHeight - 32;
          jsCodePart.style.top = this.jsPartTop + "px"
        }
        this.cssPartHeight = this.jsPartTop - newCssPartTop;
        cssCodePart.style.height = (this.jsPartTop - newCssPartTop) + "px";
        this.resizeCodeParts();

      }
      else if(this.jsVerticalResizeMode){//Js resizing ?
  
        let newJsPartTop = this.jsPartTop + (event.clientY - this.jsMousedownY);
        if(newJsPartTop <= (codePartsHeight - 32) && newJsPartTop > 64){//within valid range ?
          jsCodePart.style.top = newJsPartTop + "px";
          
          if(newJsPartTop - 32 <= this.cssPartTop){//Js titleBar eached Css titleBar ?
            this.cssPartTop = newJsPartTop - 32;
            cssCodePart.style.top = this.cssPartTop + "px";
          }
        }
        else if(newJsPartTop <= 64){//upper limit reached ?
          jsCodePart.style.top = "64px";
          this.cssPartTop = 32;
          cssCodePart.style.top = this.cssPartTop + "px";
        }
        else if (newJsPartTop >= codePartsHeight- 32){//lower limit reached ?
          jsCodePart.style.top = codePartsHeight- 32 + "px";
        }
        this.jsPartHeight = codePartsHeight - newJsPartTop;
        jsCodePart.style.height = (codePartsHeight - newJsPartTop) + "px";
        this.resizeCodeParts();
                
      }

    }
  }

  triggerResizeWithInterval(timeout){
    if(this.customInterval){
      clearInterval(this.customInterval);
    }
      this.customInterval = setInterval(()=>{
        //console.log("inside triggerResizeWithInterval");
        window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
      }, timeout); 
  }

  resizeCodeParts(){
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    let cssCodePart:HTMLElement = this.cssPart.nativeElement;
    let jsCodePart:HTMLElement = this.jsPart.nativeElement;
    let htmlCodePart:HTMLElement = this.htmlPart.nativeElement;
    let codePartsHeight = codePartsEl.offsetHeight;
    
    if(this.layout == 1 || this.layout == 3){//vertical layout ?
      htmlCodePart.style.height = cssCodePart.style.top ;
      cssCodePart.style.height = parseInt(jsCodePart.style.top) - parseInt( cssCodePart.style.top) + "px";
      jsCodePart.style.height = codePartsHeight - parseInt(jsCodePart.style.top) + "px";
    }

  }

  expandHtml(){
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    let htmlPartEl: HTMLElement = this.htmlPart.nativeElement;
    let cssPartEl: HTMLElement = this.cssPart.nativeElement;
    let jsPartEl: HTMLElement = this.jsPart.nativeElement;
    
    if(this.layout == 1 || this.layout == 3){
      this.htmlPartHeight = codePartsEl.offsetHeight - 64;
      htmlPartEl.style.height = this.htmlPartHeight + "px";

      cssPartEl.style.height = "32px";
      this.cssPartHeight = 32;
      this.cssPartTop = codePartsEl.offsetHeight - 64;
      cssPartEl.style.top = this.cssPartTop + "px";

      jsPartEl.style.height = "32px";
      this.jsPartHeight = 32;
      this.jsPartTop = codePartsEl.offsetHeight - 32;
      jsPartEl.style.top = this.jsPartTop + "px";
    }

    window.setTimeout(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 0);
  }

  expandCss(){
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    let htmlPartEl: HTMLElement = this.htmlPart.nativeElement;
    let cssPartEl: HTMLElement = this.cssPart.nativeElement;
    let jsPartEl: HTMLElement = this.jsPart.nativeElement;

    if(this.layout == 1 || this.layout == 3){
      this.htmlPartHeight = 32;
      htmlPartEl.style.height = this.htmlPartHeight + "px";

      this.cssPartHeight = codePartsEl.offsetHeight - 64;
      cssPartEl.style.height = this.cssPartHeight + "px";
      this.cssPartTop = 32;
      cssPartEl.style.top = this.cssPartTop + "px";

      jsPartEl.style.height = "32px";
      this.jsPartHeight = 32;
      this.jsPartTop = codePartsEl.offsetHeight - 32;
      jsPartEl.style.top = this.jsPartTop + "px";
    }

    window.setTimeout(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 0);
  }

  expandJs(){
    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    let htmlPartEl: HTMLElement = this.htmlPart.nativeElement;
    let cssPartEl: HTMLElement = this.cssPart.nativeElement;
    let jsPartEl: HTMLElement = this.jsPart.nativeElement;

    if(this.layout == 1 || this.layout == 3){
      this.htmlPartHeight = 32;
      htmlPartEl.style.height = this.htmlPartHeight + "px";

      this.cssPartHeight = 32;
      cssPartEl.style.height = this.cssPartHeight + "px";
      this.cssPartTop = 32;
      cssPartEl.style.top = this.cssPartTop + "px";

      this.jsPartHeight = codePartsEl.offsetHeight - 64;
      jsPartEl.style.height = this.jsPartHeight + "px";
      this.jsPartTop = 64;
      jsPartEl.style.top = this.jsPartTop + "px";
    }

    window.setTimeout(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 0);
  }

  hideModal(){
    this.modal.hide();
  }

  ressouresBtnClick(){
    this.modal.show();
  }

  splitComponentInnerDragEnd(event){
    console.log("splitComponentInnerDragEnd event = ", event);
    clearInterval(this.customInterval);
  }

  splitComponentInnerDragStart(event){
    console.log("splitComponentInnerDragStart event = ", event);
    this.triggerResizeWithInterval(50);
  }

  splitComponentOuterDragEnd(event){
    console.log("splitComponentOuterDragEnd event = ", event);
    clearInterval(this.customInterval);
    this.showIframeHider = false;
  }

  splitComponentOuterDragStart(event){
    console.log("splitComponentOuterDragStart event = ", event);
    this.triggerResizeWithInterval(50);
    this.showIframeHider = true;
  }

}