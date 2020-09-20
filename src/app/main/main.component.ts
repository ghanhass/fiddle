import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  resizeMode: boolean = false;
  resizeModeDragImg: Element = (function(){
    let el = new Image();
    el.src="data:image/png;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    return el;
  })();
  codePartsWidth: string = "300px";
  mainResizerLeft: string = "300px";
  @ViewChild("mainResizer") mainResizer:ElementRef;
  @ViewChild("codeParts") codeParts:ElementRef;
  @ViewChild("mainResizerFloor") mainResizerFloor:ElementRef;
  resizeInterval: any;

  constructor() { 
  }

  ngOnInit(): void {
    
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
  }

  mainResizerMouseupHandler(event){
    this.resizeMode = false;
    this.mainResizerFloor.nativeElement.classList.add("hide");
  }

  mainResizerMousedownHandler(event){
    this.resizeMode = true;
    this.mainResizerFloor.nativeElement.classList.remove("hide");
    //console.log("angular mousedown event: ", event);
  }

  mainResizerDragstartHandler(event: DragEvent){
    console.log("angular dragstart event: ", event);
    event.dataTransfer.setData('text/plain', 'dummy');
    event.dataTransfer.setDragImage(this.resizeModeDragImg, 99999, 99999);
    this.resizeInterval = window.setInterval(()=>{
      window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
    }, 150)
  }

  mainContainerDragoverHandler(event){
    console.log("angular dragover event: ", event);
    let self = this;
    let left = event.clientX - 5;
    if(left >= 250){
      this.mainResizer.nativeElement.style.left = left + "px";
      this.codePartsWidth = left + "px";
      this.codeParts.nativeElement.style.width = this.codePartsWidth;
      //console.log("this.codePartsWidth = ", this.codePartsWidth);
      //console.log("------------------------------------");
    }
  }
  mainResizerDragendHandler(event){
    console.log("angular dragend event: ", event);
    this.resizeMode = false;
    this.mainResizerFloor.nativeElement.classList.add("hide");
    window.clearInterval(this.resizeInterval);
  }


}
