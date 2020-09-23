import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NumberValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

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
  jsPartInitHeight: number;
  htmlPartInitHeight: number;
  @ViewChild("mainResizer") mainResizer:ElementRef;
  @ViewChild("codeParts") codeParts:ElementRef;
  @ViewChild("mainResizerFloor") mainResizerFloor:ElementRef;
  @ViewChild("verticalResizerFloor") verticalResizerFloor:ElementRef;
  @ViewChild("verticalResizerJs") verticalResizerJs:ElementRef;
  @ViewChild("verticalResizerCss") verticalResizerCss:ElementRef;

  constructor() { 
  }

  ngOnInit(): void {
    
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize(event){
    //console.log("window resize event: ", event);
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
        if(top >= 26 && (top < (jsCodePartTop - 26)) ){
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
      break
    }
    console.log("-------------------------");
  }
  /*END dragover event handler(s)*/

  mainResizerMousedownHandler(event){
    this.mainResizerFloor.nativeElement.classList.remove("hide");
    //console.log("angular mousedown event: ", event);
  }

  mainResizerDragstartHandler(event: any){
    console.log("angular mainResizerDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', 'dummy');
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
    this.verticalResizerFloor.nativeElement.classList.remove("hide");
    this.verticalResizeMode = true;
    //console.log("angular mousedown event: ", event);
    this.jsPartInitHeight = this.verticalResizerJs.nativeElement.parentNode.offsetHeight - 6;
    console.log("this.jsPartInitHeight = ", this.jsPartInitHeight);
  }

  verticalResizerCssDragstartHandler(event: DragEvent){
    console.log("angular verticalResizerCssDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', 'dummy');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.verticalResizeType = "css";
    this.verticalResizerCss.nativeElement.classList.add("resize-mode");
    
  }

  verticalResizerCssDragendHandler(event){
    console.log("angular verticalResizerCssDragendHandler: ", event);
    this.verticalResizerFloor.nativeElement.classList.add("hide");
    this.verticalResizeMode = false;
    this.verticalResizerCss.nativeElement.classList.remove("resize-mode");
    let cssCodeComponentContainerElement = this.verticalResizerCss.nativeElement.parentNode;
    let movingDistance = cssCodeComponentContainerElement.getBoundingClientRect().top - 
    this.verticalResizerCss.nativeElement.getBoundingClientRect().top;
    cssCodeComponentContainerElement.style.top = ((cssCodeComponentContainerElement.getBoundingClientRect().top - 67) - movingDistance + 20) + "px";
    this.verticalResizerCss.nativeElement.style.top = "0px";
    console.log("movingDistance = ", movingDistance);
    let jsCodeComponentContainer = document.querySelector(".code-component-container-js");
    cssCodeComponentContainerElement.style.height = (jsCodeComponentContainer.getBoundingClientRect().top - cssCodeComponentContainerElement.getBoundingClientRect().top) - 6 + "px";
  }
  ///////////////

  verticalResizerJsMousedownHandler(event){
    this.verticalResizerFloor.nativeElement.classList.remove("hide");
    this.verticalResizeMode = true;
    //console.log("angular mousedown event: ", event);
  }

  verticalResizerJsDragstartHandler(event: DragEvent){
    console.log("angular verticalResizerJsDragstartHandler event: ", event);
    event.dataTransfer.setData('text/plain', 'dummy');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.verticalResizeType = "js";
  }

  verticalResizerJsDragendHandler(event){
    console.log("angular verticalResizerJsDragendHandler event: ", event);
    this.verticalResizerFloor.nativeElement.classList.add("hide");
    this.verticalResizeMode = true;
  }


}
