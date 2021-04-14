import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import { MainService } from "../main.service";
import { IframePartComponent } from "../iframe-part/iframe-part.component";
import { ActivatedRoute } from "@angular/router";
import { ModalComponent } from '../modal/modal.component';
import { SplitComponent } from "angular-split";
import { RessourcesComponent } from '../ressources/ressources.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../loader/loader.component';
import { environment } from "../../environments/environment";

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

  codePartsOffsetHeight: number = 0;
  codePartsOffsetWidth: number = 0;

  htmlPartTop: number = 0;
  cssPartTop:number = 0;
  jsPartTop:number = 0;

  customInterval: any;
  canChangeSplitSizes: boolean = true;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;

  @ViewChild("splitComponentInner") splitComponentInner: SplitComponent;


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
  @ViewChild("ressources") ressourcesComponent: RessourcesComponent;
  @ViewChild("loader")loader:LoaderComponent;

  cssCodePartTitle: HTMLElement;
  jsCodePartTitle: HTMLElement;

  jsCode: string = "";
  cssCode: string = "";
  htmlCode: string = "";
  isLayoutsListShown: boolean = false;
  layout: number = 1;
  fiddleTitle: string = "";

  initialHtmlCodePartSize: number = 0;
  initialCssCodePartSize: number = 0;
  initialJsCodePartSize: number = 0;

  mainContainerWidth: number = 0;
  mainContainerHeight: number = 0;

  newHtmlCodePartSize: number = 0;
  newCssCodePartSize: number = 0;
  newJsCodePartSize: number = 0;
  
  constructor(private mainService: MainService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) { 
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
          this.fiddleTitle = this.mainService.fiddleTitle;
          //this.layout = this.mainService.layout;
          this.changeLayout(this.mainService.layout);
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
              this.fiddleTitle = obj.title;
              //this.layout = obj.layout;
              //
              this.mainService.jsCode = obj.js;
              this.mainService.htmlCode = obj.html;
              this.mainService.cssCode = obj.css;
              this.mainService.fiddleTitle = obj.title;
              this.changeLayout(parseInt(obj.layout), {operation: "fiddleLoad", data:obj});
              this.runCode();
            }
          });
        }
      }
    });

    let codePartsEl: HTMLElement = this.codeParts.nativeElement;
    this.codePartsOffsetHeight = codePartsEl.offsetHeight;
    this.codePartsOffsetWidth = codePartsEl.offsetWidth;

    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    if(mainContainerEl){
      this.mainContainerWidth = mainContainerEl.offsetWidth;
      this.mainContainerHeight = mainContainerEl.offsetHeight;
    }

    this.splitComponentInner.dragProgress$.subscribe((res)=>{
      //console.log("dragProgress$ res = ", res);
      let sizes = this.splitComponentInner.getVisibleAreaSizes();
      this.newHtmlCodePartSize = sizes[1] as number;
      this.newCssCodePartSize = sizes[2] as number;
      this.newJsCodePartSize = sizes[3] as number;

      this.setMainServiceCodepartSizes();
      //console.log("sizes = ", sizes);
    })
    //console.log("codePartsOffsetHeight = ", this.codePartsOffsetHeight);
    this.initialCssCodePartSize = (this.codePartsOffsetHeight - 20) / 3;
    this.initialHtmlCodePartSize = (this.codePartsOffsetHeight - 20) / 3;
    this.initialJsCodePartSize = (this.codePartsOffsetHeight - 20) / 3;

    this.newCssCodePartSize = this.initialCssCodePartSize;
    this.newHtmlCodePartSize = this.initialHtmlCodePartSize;
    this.newJsCodePartSize = this.initialJsCodePartSize;


    this.fixCodePartsDimensions();
  }

  setMainServiceCodepartSizes(){
    this.mainService.htmlCodePartSize = this.newHtmlCodePartSize;
    this.mainService.cssCodePartSize = this.newCssCodePartSize;
    this.mainService.jsCodePartSize = this.newJsCodePartSize;
  }

  ngDoCheck(){
    console.log("this.mainService.htmlCodePartSize = ", this.mainService.htmlCodePartSize)
    console.log("this.newHtmlCodePartSize = ", this.newHtmlCodePartSize)
    
    console.log("-------------------------------------------------------");
    
    console.log("this.mainService.cssCodePartSize = ", this.mainService.cssCodePartSize)
    console.log("this.newCssCodePartSize = ", this.newCssCodePartSize)

    console.log("-------------------------------------------------------");

    console.log("this.mainService.jsCodePartSize = ", this.mainService.jsCodePartSize)
    console.log("this.newJsCodePartSize = ", this.newJsCodePartSize)
    console.log("-------------------------------------------------------");
  }

  /**
   * Sets dimensions of each .code-component whenever needed using optimized setInterval for each one
   * @returns void.
   */
  fixCodePartsDimensions(): void{
    let self = this;
    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;

    if(mainContainerEl){
      let codePartsArray: Array<HTMLElement> = Array.from(mainContainerEl.querySelectorAll(".code-component"));
      for(let ind = 0; ind < codePartsArray.length; ind++){
        let codePart = codePartsArray[ind];
        //console.log("A");
        if(codePart){
          //console.log("B");
          let overflowGuardElement: HTMLElement = codePart.querySelector(".overflow-guard");
          if(overflowGuardElement){
            //console.log("C");
            let marginElement: HTMLElement = overflowGuardElement.querySelector(".margin");
            let scrollableElement: HTMLElement = overflowGuardElement.querySelector(".monaco-scrollable-element.editor-scrollable.vs");
            if(marginElement && scrollableElement){
              //console.log("D");
              let customInterval = setInterval(()=>{
                let check: boolean = (marginElement.offsetWidth + scrollableElement.offsetWidth) == overflowGuardElement.offsetWidth;
                check = check && marginElement.offsetHeight == scrollableElement.offsetHeight && 
                marginElement.offsetHeight == overflowGuardElement.offsetHeight;
                if(check){
                  clearInterval(customInterval);
                  //console.log("E1");
                }
                else{
                  window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
                  //console.log("E2");
                }
              }, 10);
            }
          }
        }
      }
    }
  }

  changeLayout(newLayout: number, param?: any){
      if(newLayout != this.layout){
        this.layout = newLayout;
        this.mainService.layout = newLayout;
        let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
        if(mainContainerEl){
          window.setTimeout(()=>{
            this.mainContainerHeight = mainContainerEl.offsetHeight;
            this.mainContainerWidth = mainContainerEl.offsetWidth;
            switch(this.layout){
              case 1:
              this.initialCssCodePartSize = (this.mainContainerHeight - 20) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerHeight - 20) / 3;
              this.initialJsCodePartSize = (this.mainContainerHeight - 20) / 3;
              this.fixCodePartsDimensions();
              break;
              case 2:
              this.initialCssCodePartSize = (this.mainContainerWidth - 20) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerWidth - 20) / 3;
              this.initialJsCodePartSize = (this.mainContainerWidth - 20) / 3;
              this.fixCodePartsDimensions();
              break;
              case 3:
              this.initialCssCodePartSize = (this.mainContainerHeight - 20) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerHeight - 20) / 3;
              this.initialJsCodePartSize = (this.mainContainerHeight - 20) / 3;
              this.fixCodePartsDimensions();
              break;
              case 4:
              this.initialCssCodePartSize = (this.mainContainerWidth - 20) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerWidth - 20) / 3;
              this.initialJsCodePartSize = (this.mainContainerWidth - 20) / 3;
              this.fixCodePartsDimensions();
              break;
            }
            this.newCssCodePartSize = this.initialCssCodePartSize;
            this.newHtmlCodePartSize = this.initialHtmlCodePartSize;
            this.newJsCodePartSize = this.initialJsCodePartSize;
          }, 1);
        }
      }
  }

  getAndAdaptSavedCodePartsSizes(layout, param){
    if(param !== undefined && param !== null && param.operation == "fiddleLoad"){
      let savedLayout = parseInt(param.data.layout); 
      
      let savedCssCodePartSize = parseInt(param.data.cssCodePartSize); 
      let savedJsCodePartSize = parseInt(param.data.jsCodePartSize); 
      let savedHtmlCodePartSize = parseInt(param.data.htmlCodePartSize); 

      let savedMainContainerSize = parseInt(param.data.mainContainerSize); 
    }
  }

  getLayoutInfos(name){
    switch(name){
      case "htmlAsSplitAreaSize":
      return this.initialHtmlCodePartSize;

      case "cssAsSplitAreaSize":
      return this.initialCssCodePartSize

      case "jsAsSplitAreaSize":
      return this.initialJsCodePartSize;
    }
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

        case "cssAsSplitAreaMinSize":
        return 25;

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
      switch(name){
        case "outerAsSplitDirection":
        return "vertical";
        
        case "outerAsSplitUnit":
        return "pixel";

        case "codePartsAsSplitAreaOrder":
        return 1;

        case "codePartsAsSplitAreaMinSize":
        return 290;

        case "codePartsAsSplitAreaSize":
        return 290;

        case "innerAsSplitDirection":
        return 'horizontal';

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

        case "cssAsSplitAreaMinSize":
        return 25;

        case "jsAsSplitAreaMinSize":
        return 25;

        case "iframeAsSplitAreaOrder":
        return 2;

        case "iframeAsSplitAreaMinSize":
        return 290;

        case "iframeAsSplitAreaSize":
        return "*";
      }
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

        case "cssAsSplitAreaMinSize":
        return 25;

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
      switch(name){
        case "outerAsSplitDirection":
        return "vertical";
        
        case "outerAsSplitUnit":
        return "pixel";

        case "codePartsAsSplitAreaOrder":
        return 2;

        case "codePartsAsSplitAreaMinSize":
        return 290;

        case "codePartsAsSplitAreaSize":
        return 290;

        case "innerAsSplitDirection":
        return 'horizontal';

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

        case "cssAsSplitAreaMinSize":
        return 25;

        case "jsAsSplitAreaMinSize":
        return 25;

        case "iframeAsSplitAreaOrder":
        return 1;

        case "iframeAsSplitAreaMinSize":
        return 290;

        case "iframeAsSplitAreaSize":
        return "*";
      }
      break;
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
    this.toggleLayoutsList(true);
    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    
    let newWindowWidth = window.innerWidth;
    let newWindowHeight = window.innerHeight;

    if(mainContainerEl && this.canChangeSplitSizes && (newWindowHeight !== this.windowHeight || newWindowWidth !== this.windowWidth)){
      //console.log("/!\ window resize event: ", event);

      this.windowWidth = newWindowWidth;
      this.windowHeight = newWindowHeight;
      
      let newMainContainerWidth = mainContainerEl.offsetWidth;
      let newMainContainerHeight = mainContainerEl.offsetHeight;
      //console.log("newMainContainerHeight: ", newMainContainerHeight);
      //console.log("this.mainContainerHeight: ", this.mainContainerHeight);

      //console.log("newMainContainerWidth: ", newMainContainerWidth);
      //console.log("this.mainContainerWidth: ", this.mainContainerWidth);
      let bool:boolean;
      let mainContainerWidthOrHeight;
      let newMainContainerWidthOrHeight;
      if(this.layout == 1 || this.layout == 3){
        mainContainerWidthOrHeight = this.mainContainerHeight;
        newMainContainerWidthOrHeight = newMainContainerHeight;
      }
      else{
        mainContainerWidthOrHeight = this.mainContainerWidth;
        newMainContainerWidthOrHeight = newMainContainerWidth;
      }
      let sizes: Array<any> = this.splitComponentInner.getVisibleAreaSizes();
      if(newMainContainerWidthOrHeight > mainContainerWidthOrHeight){
        let coef = newMainContainerWidthOrHeight / mainContainerWidthOrHeight;
        
        sizes[1] = sizes[1] * coef;
        sizes[2] = sizes[2] * coef;
        sizes[3] = sizes[3] * coef;
      }
      else{
        let coef = mainContainerWidthOrHeight / newMainContainerWidthOrHeight;
        sizes[1] = (sizes[1] / coef) > 25 ? (sizes[1] / coef) : 25;
        sizes[2] = (sizes[2] / coef) > 25 ? (sizes[2] / coef) : 25;
        sizes[3] = (sizes[3] / coef) > 25 ? (sizes[3] / coef) : 25;
      }

      this.reAdaptCodePartsSizes(sizes, newMainContainerWidthOrHeight - 22);

      this.mainContainerHeight = newMainContainerHeight;
      this.mainContainerWidth = newMainContainerWidth;
    }
  }
  
  /**
   * Recalculates the width/height of each code part area when there is a window resize.
   * @param sizes Split Component areas sizes array
   * @param newMainContainerWidthOrHeight new offsetWidth or offsetHeight of .main-container
   */
  reAdaptCodePartsSizes(sizes: Array<number>, newMainContainerWidthOrHeight: number){
    let total = sizes[1] + sizes[2] + sizes[3];
    let keeping = true;
    if(total > newMainContainerWidthOrHeight){
      do
      {
        for(let ind = 1;ind <=3; ind++){
          if((sizes[1]+sizes[2]+sizes[3]) > newMainContainerWidthOrHeight){
            if(sizes[ind]>25){
              sizes[ind]--;
            }
          }
          else{
            keeping = false;
            break;
          }
        }
      }
      while(keeping);
    }
    else if(total < newMainContainerWidthOrHeight){
      do
      {
        for(let ind = 1;ind <=3; ind++){
          if((sizes[1]+sizes[2]+sizes[3]) < newMainContainerWidthOrHeight){
            sizes[ind]++;
          }
          else{
            keeping = false;
            break;
          }
        }
      }
      while(keeping);
    }
    this.splitComponentInner.setVisibleAreaSizes(sizes);
    this.newHtmlCodePartSize = sizes[1] as number;
    this.newCssCodePartSize = sizes[2] as number;
    this.newJsCodePartSize = sizes[3] as number;
  }

  runCode(param?){
    this.iframePart.runCode(param);
  }

  isMobileMode(){
    return (window.innerWidth < 768 || window.innerHeight < 581);
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

  triggerResizeWithInterval(timeout){
    if(this.customInterval){
      clearInterval(this.customInterval);
    }
      this.customInterval = setInterval(()=>{
        //console.log("inside triggerResizeWithInterval");
        window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
      }, timeout); 
  }


  hideModal(){
    this.modal.hide();
  }

  ressouresBtnClick(){
    this.modal.show();
  }

  splitComponentInnerDragEnd(event){
    //console.log("splitComponentInnerDragEnd event = ", event);
    clearInterval(this.customInterval);
    this.canChangeSplitSizes = true;
  }

  splitComponentInnerDragStart(event){
    //console.log("splitComponentInnerDragStart event = ", event);
    this.triggerResizeWithInterval(50);
    this.canChangeSplitSizes = false;
  }

  splitComponentOuterDragEnd(event){
    //console.log("splitComponentOuterDragEnd event = ", event);
    clearInterval(this.customInterval);
    this.showIframeHider = false;
  }

  splitComponentOuterDragStart(event){
    //console.log("splitComponentOuterDragStart event = ", event);
    this.triggerResizeWithInterval(50);
    this.showIframeHider = true;
  }

  validateRessources(){
    this.ressourcesComponent.validateRessources();
    this.hideModal();
  }

  onRessourcesValidate(dataEvent: Array<string>){
    this.htmlCode = this.mainService.htmlCode;
    dataEvent.forEach((el, index, arr)=>{
      this.htmlCode = arr[arr.length - 1 - index] + this.htmlCode;
    });
    this.ressourcesComponent.resetCurrentRessourceChoice();
    this.ressourcesComponent.emptySelectedRessourceAssets();
    this.toastrService.success("Ressources prepended to HTML code.");
  }

  getVerticalModeState(codePartType: string){
    if(this.layout == 2 || this.layout == 4){
      switch(codePartType){
        case("html"):
        if(this.newHtmlCodePartSize < 150){
          return true
        }
        else{
          return false;
        }
  
        case("js"):
        if(this.newJsCodePartSize < 200){
          return true
        }
        else{
          return false;
        }
  
        case("css"):
        if(this.newCssCodePartSize < 150){
          return true
        }
        else{
          return false;
        }
      }
    }
    else{
      return false;
    }
  }

  getFiddleInputWidth(){
    let width = 0;
    for(let ind = 0; ind < this.fiddleTitle.length; ind++){
      width += 10;
    }
    //console.log("width = ", width);
    return width == 0 ? "" : width+"px";
  }

  onFiddeTitleChange(data){
    this.mainService.fiddleTitle = data;
    //console.log("@onFiddeTitleChange this.mainService.fiddleTitle = ", this.mainService.fiddleTitle);
  }

  onIframePartShowLoader(){
    this.loader.showLoader();
  }

  onIframePartHideLoader(){
    this.loader.hideLoader();
  }

  getHomeUrl(){
    return environment.homeUrl;
  }

}