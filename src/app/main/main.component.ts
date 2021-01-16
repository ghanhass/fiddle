import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MainService } from "../main.service";
import { IframePartComponent } from "../iframe-part/iframe-part.component";
import { ActivatedRoute } from "@angular/router";

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
  
  isHtmlFullScreen: boolean = false;
  isCssFullScreen: boolean = false;
  isJsFullScreen: boolean = false;


  resizeModeDragImg: Element = (function(){
    let el = new Image();
    el.src="data:image/png;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    return el;
  })();
  
  mainResizerLeft: string = "300px";
  mainResizerRight: string = "auto";
  //verticalResizerJsTop: string = "0px";
  //verticalResizerCssTop: string = "0px";
  verticalResizeMode:boolean = false;
  
  cssVerticalResizeMode:boolean = false;
  jsVerticalResizeMode:boolean = false;

  htmlPartHeight:number = 0;
  cssPartHeight:number = 0;
  jsPartHeight:number = 0;

  htmlPartTop: number = 0;
  cssPartTop:number = 0;
  jsPartTop:number = 0;
  
  cssMousedownY: number = 0;
  jsMousedownY: number = 0;

  mainResizeMode:boolean = false;
  verticalResizeType:string = "";
  customInterval: any;

  @ViewChild("mainResizer") mainResizer:ElementRef;
  @ViewChild("codeParts") codeParts:ElementRef;
  
  @ViewChild("htmlPart") htmlPart:ElementRef;
  @ViewChild("cssPart") cssPart:ElementRef;
  @ViewChild("jsPart") jsPart:ElementRef;

  @ViewChild("mainResizerFloor") mainResizerFloor:ElementRef;

  @ViewChild("iframePart") iframePart:IframePartComponent;
  @ViewChild("layout1") layout1: ElementRef;
  @ViewChild("layout2") layout2: ElementRef;
  @ViewChild("layout3") layout3: ElementRef;
  @ViewChild("layoutsList") layoutsList: ElementRef;

  cssCodePartTitle: HTMLElement;
  jsCodePartTitle: HTMLElement;

  jsCode: string = "";
  cssCode: string = "";
  htmlCode: string = "";
  isLayoutsListShown: boolean = false;
  layout: number = 1;

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
    this.initCodeParts(this.layout); 
  }

  initCodeParts(layout:number): void{
    let codePartsEl: HTMLElement = this.codeParts.nativeElement
    let htmlPartEl: HTMLElement = this.htmlPart.nativeElement;
    let cssPartEl: HTMLElement = this.cssPart.nativeElement;
    let jsPartEl: HTMLElement = this.jsPart.nativeElement;
    let codePartsHeight = codePartsEl.offsetHeight;

    if( layout == 1 || layout == 3){
      if(htmlPartEl){
        this.htmlPartHeight = codePartsHeight / 3;
        htmlPartEl.style.height = this.htmlPartHeight + "px";
        this.htmlPartTop = 0;
        htmlPartEl.style.top = this.htmlPartTop + "px";
        console.log("htmlPartHeight = ", this.htmlPartHeight);
      }
      if(cssPartEl){
        this.cssPartHeight = codePartsHeight / 3;
        cssPartEl.style.height = this.cssPartHeight + "px";
        this.cssPartTop = codePartsHeight / 3;
        cssPartEl.style.top = this.cssPartTop + "px";
        console.log("cssPartHeight = ", this.cssPartHeight);
      }
      if(jsPartEl){
        this.jsPartHeight = codePartsHeight / 3;
        jsPartEl.style.height = this.jsPartHeight + "px";
        this.jsPartTop = codePartsHeight * 2 / 3;
        jsPartEl.style.top = this.jsPartTop + "px";
        console.log("jsPartHeight = ", this.jsPartHeight);
      }
    }
    window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
  }

  changeLayout(newLayout: number){
    if(newLayout != this.layout){
      this.layout = newLayout;
      let mainResizerEl: HTMLElement = this.mainResizer.nativeElement;
      let codePartsEl: HTMLElement = this.codeParts.nativeElement;
      if(mainResizerEl && codePartsEl){
        switch(this.layout){
          case 1:
          mainResizerEl.style.left = "300px";
          mainResizerEl.style.right = "auto";
          codePartsEl.style.width = "300px";
          codePartsEl.style.minWidth = "300px";
          (codePartsEl.querySelector(".code-component-container-html") as HTMLElement).style.cssText = "height: 33.33%;top: 0px;";
          (codePartsEl.querySelector(".code-component-container-css") as HTMLElement).style.cssText = "height: 33.33%;top: 33.33%;";
          (codePartsEl.querySelector(".code-component-container-js") as HTMLElement).style.cssText = "height: 33.34%;top: 66.33%;";
          break;
          case 2:
          break;
          case 3:
          mainResizerEl.style.left = "auto";
          mainResizerEl.style.right = "300px";
          codePartsEl.style.width = "300px";
          codePartsEl.style.minWidth = "300px";
          (codePartsEl.querySelector(".code-component-container-html") as HTMLElement).style.cssText = "height: 33.33%;top: 0px;";
          (codePartsEl.querySelector(".code-component-container-css") as HTMLElement).style.cssText = "height: 33.33%;top: 33.33%;";
          (codePartsEl.querySelector(".code-component-container-js") as HTMLElement).style.cssText = "height: 33.34%;top: 66.33%;";
          break;
          case 4:
        }
        this.initCodeParts(this.layout);
      }
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


  @HostListener("window:resize", ["$event"])
  onWindowResize(event){
    //console.log("/!\ window resize event: ", event);
    this.toggleLayoutsList(true);
  }

  @HostListener("window:click", ["$event"])
  onWindowClick(event){
    this.resetResizersAppearance();
    //console.log("click event.target = ", event.target);
  }

  runCode(param?){
    this.iframePart.runCode(param);
  }

  resetResizersAppearance(){
    this.mainResizerFloor.nativeElement.classList.add("hide");
    this.mainResizerFloor.nativeElement.classList.remove("resize-mode");
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

  /*START dragover event handler(s)*/
  mainContainerDragoverHandler(event){
    if(!this.verticalResizeMode){
      //console.log("angular dragover event: ", event);
      if(this.layout == 1 || this.layout == 3){
        let left = event.clientX - 5;
        let mainContainerElement: Element = this.codeParts.nativeElement.parentNode;
        if(this.layout == 1){
          if(left >= 250 && left < mainContainerElement.getBoundingClientRect().right - 8){
            this.mainResizerLeft = left + "px";
            this.mainResizerRight = "auto"; 
            this.mainResizer.nativeElement.style.left = this.mainResizerLeft;
            this.mainResizer.nativeElement.style.right = this.mainResizerRight;
          }
        }
        else if(this.layout == 3){
          if(left < (window.innerWidth - 250) && left > mainContainerElement.getBoundingClientRect().left - 8){
            this.mainResizerLeft = "auto";
            this.mainResizerRight = (window.innerWidth - event.clientX) - 10 + "px"; 
            this.mainResizer.nativeElement.style.left = this.mainResizerLeft;
            this.mainResizer.nativeElement.style.right = this.mainResizerRight;
          }
        }
      }
    }
  }

  mainResizerMousedownHandler(event){
    this.mainResizerFloor.nativeElement.classList.remove("hide");
    //console.log("angular mousedown event: ", event);
  }

  mainResizerDragstartHandler(event: any){
    //console.log("angular mainResizerDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.mainResizeMode = true;
    this.mainResizerLeft = (event.target.getBoundingClientRect().left - 5) + "px";
  }

  mainResizerDragendHandler(event){
    this.mainResizeMode = false;
    //console.log("angular mainResizerDragendHandler event: ", event);
    if(this.layout == 1){
      this.codeParts.nativeElement.style.width = this.mainResizerLeft;
      this.codeParts.nativeElement.style.minWidth = this.mainResizerLeft; 
    }
    else if(this.layout == 3){
      this.codeParts.nativeElement.style.width = this.mainResizerRight;
      this.codeParts.nativeElement.style.minWidth = this.mainResizerRight; 
    }
    this.mainResizerFloor.nativeElement.classList.add("hide");
    window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
  }
  
  @HostListener("window:mouseup", ["$event"])
  onWindowMouseup(event){
    this.resetResizersAppearance();
    console.log("mouseup event: ", event);
    let cssPartEl : HTMLElement = this.cssPart.nativeElement;
    let htmlPartEl : HTMLElement = this.htmlPart.nativeElement;
    let jsPartEl : HTMLElement = this.jsPart.nativeElement;

    this.cssPartHeight = cssPartEl.offsetHeight;
    this.htmlPartHeight =  htmlPartEl.offsetHeight;
    this.jsPartHeight =  jsPartEl.offsetHeight;

    if(this.cssVerticalResizeMode){
      this.cssVerticalResizeMode = false;
      this.cssPartTop = parseInt(cssPartEl.style.top);
    }
    if(this.jsVerticalResizeMode){
      this.jsVerticalResizeMode = false;
      this.jsPartTop = parseInt(jsPartEl.style.top);
    }
    window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    
    if(this.customInterval){
      clearInterval(this.customInterval);
    }
    
  }
  
  codePartsTitleMousedown(event: MouseEvent, mode){
    console.log("codePartsTitleMousedown event = ", event);
    console.log("codePartsTitleMousedown mode = ", mode)
    if(this.layout == 1 || this.layout == 3){
      switch(mode){
        case "css":
        this.cssCodePartTitle = <HTMLElement>event.target;
        this.cssMousedownY = event.clientY;
        this.cssVerticalResizeMode = true;
        this.triggerResizeWithInterval();
        break;
  
        case "js":
        this.jsCodePartTitle = <HTMLElement>event.target;
        this.jsMousedownY = event.clientY;
        this.jsVerticalResizeMode = true;
        this.triggerResizeWithInterval();
        break;
      }
    }
  }

  codePartsMousemove(event: MouseEvent){
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

  triggerResizeWithInterval(){
      this.customInterval = setInterval(()=>{
        console.log("inside triggerResizeWithInterval");
        window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
      }, 250); 
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

}