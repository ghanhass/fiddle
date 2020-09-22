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
  resizeInterval: any;

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
    //console.log("angular #code-parts dragover event: ", event);
    console.log("angular #code-parts dragover event: ", event.clientX+" X "+event.clientY)
    event.stopPropagation();
    switch(this.verticalResizeType){
      case "css":
      //this.verticalResizerCss.nativeElement.style.top = (event.clientY - 45) + "px"
      let cssCodeComponentContainerElement: any = this.verticalResizerCss.nativeElement.parentNode;
      let jsCodeComponentContainerElement: any = this.verticalResizerJs.nativeElement.parentNode;
      let htmlCodeComponentContainerElement: any = this.codeParts.nativeElement.querySelector(".code-component-container-html");
      
      if(cssCodeComponentContainerElement){
        let newHeight = jsCodeComponentContainerElement.getBoundingClientRect().top - event.clientY;
        if(newHeight > 20 && (event.clientY - htmlCodeComponentContainerElement.getBoundingClientRect().top) > 25 ){
          let jsCodePartHeight = jsCodeComponentContainerElement.getBoundingClientRect().height;
          console.log("#newHeight = ", newHeight);
          console.log("#code-parts height = ", this.codeParts.nativeElement.offsetHeight); 
          cssCodeComponentContainerElement.style.height = newHeight + "px";
          cssCodeComponentContainerElement.style.minHeight = newHeight + "px";
          jsCodeComponentContainerElement.style.maxHeight = this.jsPartInitHeight + "px";
          jsCodeComponentContainerElement.style.minHeight = this.jsPartInitHeight + "px";
        }
      }
      break;
      case "js":
      break
    }
    console.log("-------------------------")
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
    window.clearInterval(this.resizeInterval);
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
    this.resizeInterval = window.setInterval(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 75);
    this.verticalResizeType = "css";
    
    
  }

  verticalResizerCssDragendHandler(event){
    console.log("angular verticalResizerCssDragendHandler: ", event);
    this.verticalResizerFloor.nativeElement.classList.add("hide");
    window.clearInterval(this.resizeInterval);
    this.verticalResizeMode = false;
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
    this.resizeInterval = window.setInterval(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 75);
    this.verticalResizeType = "js";
  }

  verticalResizerJsDragendHandler(event){
    console.log("angular verticalResizerJsDragendHandler event: ", event);
    this.verticalResizerFloor.nativeElement.classList.add("hide");
    window.clearInterval(this.resizeInterval);
    this.verticalResizeMode = true;
  }


}
