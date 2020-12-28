import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MainService } from "../main.service";
import { IframePartComponent } from "../iframe-part/iframe-part.component";
import { ActivatedRoute } from "@angular/router";
import { indigo } from 'color-name';

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


  resizeModeDragImg: Element = (function(){
    let el = new Image();
    el.src="data:image/png;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    return el;
  })();
  codePartsWidth: string = "300px";
  mainResizerLeft: string = "300px";
  verticalResizerJsTop: string = "0px";
  verticalResizerCssTop: string = "0px";
  verticalResizeMode:boolean = false;
  mainResizeMode:boolean = false;
  verticalResizeType:string = "";
  cssPartInitHeight: number;
  htmlPartInitHeight: number;
  @ViewChild("mainResizer") mainResizer:ElementRef;
  @ViewChild("codeParts") codeParts:ElementRef;
  @ViewChild("mainResizerFloor") mainResizerFloor:ElementRef;
  @ViewChild("verticalResizerFloor") verticalResizerFloor:ElementRef;
  @ViewChild("verticalResizerJs") verticalResizerJs:ElementRef;
  @ViewChild("verticalResizerCss") verticalResizerCss:ElementRef;
  @ViewChild("iframePart") iframePart:IframePartComponent;
  jsCode: string = "";
  cssCode: string = "";
  htmlCode: string = "";

  constructor(private mainService: MainService,
    private activatedRoute: ActivatedRoute) { 
    //window.addEventListener("resize", (ev)=>{console.log("ev = ", ev);});
  }

  ngAfterViewInit(): void {
    let self = this;
    let currentFiddleId = undefined;
    
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
              console.log("getFiddle obj = ", obj);
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
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize(event){
    //console.log("/!\ window resize event: ", event);
  }

  @HostListener("window:click", ["$event"])
  onWindowClick(event){
    this.resetResizersAppearance();
  }

  @HostListener("window:mouseup", ["$event"])
  onWindowMouseup(event){
    this.resetResizersAppearance();
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
      let left = event.clientX - 5;
      let mainContainerElement: Element = this.codeParts.nativeElement.parentNode;
      if(left >= 250 && left < mainContainerElement.getBoundingClientRect().right - 8){
        this.mainResizer.nativeElement.style.left = left + "px";
        this.mainResizerLeft = left + "px";
      }
    }
  }

  codePartsDragoverHandler(event: DragEvent){
    //console.log("angular #code-parts dragover event: ", event.clientX+" X "+event.clientY)
    event.stopPropagation();
    switch(this.verticalResizeType){
      case "css":
      let cssCodeComponentContainerElement: any = this.verticalResizerCss.nativeElement.parentNode;
      let jsCodeComponentContainerElement: any = this.verticalResizerJs.nativeElement.parentNode;
      let jsCodePartTop = jsCodeComponentContainerElement.getBoundingClientRect().top - 45;
      if(cssCodeComponentContainerElement){
        let top = event.clientY - 45  ;
        if(top >= 36 && (top < (jsCodePartTop - 36)) ){
          //console.log("valid zone !");
          let newTop = event.clientY - cssCodeComponentContainerElement.getBoundingClientRect().top;
          this.verticalResizerCss.nativeElement.style.top = newTop + "px";
        }
        else{
          //console.log("invalid zone !");
        }
      }
      break;
      case "js":
      let cssCodeComponentContainerElement2: any = this.verticalResizerCss.nativeElement.parentNode;
      let jsCodeComponentContainerElement2: any = this.verticalResizerJs.nativeElement.parentNode;
      let jsCodePartBottom = jsCodeComponentContainerElement2.getBoundingClientRect().bottom - 45;
      let cssCodePartTop = cssCodeComponentContainerElement2.getBoundingClientRect().top - 45;
      if(jsCodeComponentContainerElement2){
        let top = event.clientY - 45  ;
        if(top > (cssCodePartTop + 36) && (top < (jsCodePartBottom - 36)) ){
          //console.log("valid zone !");
          let newTop = event.clientY - jsCodeComponentContainerElement2.getBoundingClientRect().top;
          this.verticalResizerJs.nativeElement.style.top = newTop + "px";
        }
        else{
          //console.log("invalid zone !");
        }
      }
      break
    }
    //console.log("-------------------------");
  }
  /*END dragover event handler(s)*/

  mainResizerMousedownHandler(event){
    this.mainResizerFloor.nativeElement.classList.remove("hide");
    //console.log("angular mousedown event: ", event);
  }

  mainResizerDragstartHandler(event: any){
    console.log("angular mainResizerDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.mainResizeMode = true;
    this.mainResizerLeft = (event.target.getBoundingClientRect().left - 5) + "px";
  }

  mainResizerDragendHandler(event){
    this.mainResizeMode = false;
    console.log("angular mainResizerDragendHandler event: ", event);
    this.codePartsWidth = this.mainResizerLeft;
    this.codeParts.nativeElement.style.width = this.mainResizerLeft;
    this.codeParts.nativeElement.style.minWidth = this.mainResizerLeft; 
    this.mainResizerFloor.nativeElement.classList.add("hide");
    window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
  }
  ///////////////

  verticalResizerCssMousedownHandler(event){
    this.verticalResizeMode = true;
    //console.log("angular mousedown event: ", event);
  }

  verticalResizerCssDragstartHandler(event: DragEvent){
    console.log("angular verticalResizerCssDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.verticalResizeType = "css";
    this.verticalResizerCss.nativeElement.classList.add("resize-mode");
    
  }

  verticalResizerCssDragendHandler(event){
    console.log("angular verticalResizerCssDragendHandler: ", event);
    this.verticalResizeMode = false;
    this.verticalResizerCss.nativeElement.classList.remove("resize-mode");
    let cssCodeComponentContainerElement = this.verticalResizerCss.nativeElement.parentNode;
    let movingDistance = cssCodeComponentContainerElement.getBoundingClientRect().top - 
    this.verticalResizerCss.nativeElement.getBoundingClientRect().top;
    cssCodeComponentContainerElement.style.top = ((cssCodeComponentContainerElement.getBoundingClientRect().top - 67) - movingDistance + 20) + "px";
    this.verticalResizerCss.nativeElement.style.top = "0px";
    console.log("movingDistance = ", movingDistance);
    let jsCodeComponentContainer = document.querySelector(".code-component-container-js");
    let htmlCodeComponentContainer: any = document.querySelector(".code-component-container-html");
    htmlCodeComponentContainer.style.height = htmlCodeComponentContainer.getBoundingClientRect().height - movingDistance - 2 + "px";
    cssCodeComponentContainerElement.style.height = (jsCodeComponentContainer.getBoundingClientRect().top - cssCodeComponentContainerElement.getBoundingClientRect().top) - 6 + "px";
    window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
  }
  ///////////////

  verticalResizerJsMousedownHandler(event){
    this.verticalResizeMode = true;
    //console.log("angular mousedown event: ", event);
  }

  verticalResizerJsDragstartHandler(event: DragEvent){
    console.log("angular verticalResizerJsDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', '');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.verticalResizeType = "js";
    this.verticalResizerJs.nativeElement.classList.add("resize-mode");
  }

  verticalResizerJsDragendHandler(event){
    console.log("angular verticalResizerJsDragendHandler: ", event);
    this.verticalResizeMode = false;
    this.verticalResizerJs.nativeElement.classList.remove("resize-mode");
    let jsCodeComponentContainerElement = this.verticalResizerJs.nativeElement.parentNode;
    let movingDistance = jsCodeComponentContainerElement.getBoundingClientRect().top - 
    this.verticalResizerJs.nativeElement.getBoundingClientRect().top;
    jsCodeComponentContainerElement.style.top = ((jsCodeComponentContainerElement.getBoundingClientRect().top - 65) - movingDistance + 20) + "px";
    this.verticalResizerJs.nativeElement.style.top = "0px";
    console.log("movingDistance = ", movingDistance);
    
    let cssCodeComponentContainer: any = document.querySelector(".code-component-container-css");

    cssCodeComponentContainer.style.height = cssCodeComponentContainer.getBoundingClientRect().height - movingDistance - 2 + "px";
    jsCodeComponentContainerElement.style.height = (this.codeParts.nativeElement.getBoundingClientRect().bottom - jsCodeComponentContainerElement.getBoundingClientRect().top) - 6 + "px";
    window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
  }


}
