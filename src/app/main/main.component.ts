import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { MainService } from "../main.service";
import { IframePartComponent } from "../iframe-part/iframe-part.component";
import { ActivatedRoute } from "@angular/router";
import { ModalComponent } from '../modal/modal.component';
import { SplitComponent } from "angular-split";
import { RessourcesComponent } from '../ressources/ressources.component';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../loader/loader.component';
import { environment } from "../../environments/environment";
import { FiddleTheme } from "src/app/fiddle-theme";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

  showHtml: boolean = true;
  showCss: boolean = false;
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

  @ViewChild("splitComponentOuter") splitComponentOuter: SplitComponent;

  @ViewChild("splitComponentIframeResize") splitComponentIframeResize: SplitComponent;


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
  isDonationsListShown: boolean = false;
  isThemesListShown: boolean = false;
  layout: number = 1;
  fiddleTitle: string = "";

  initialHtmlCodePartSize: number = 0;
  initialCssCodePartSize: number = 0;
  initialJsCodePartSize: number = 0;
  initialCodePartSize: number = 0;

  mainContainerWidth: number = 0;
  mainContainerHeight: number = 0;

  newHtmlCodePartSize: number = 0;
  newCssCodePartSize: number = 0;
  newJsCodePartSize: number = 0;
  newCodePartSize: number = 0;

  iframeWidth: number;
  iframeHeight: number;
  IsAfterViewInitReached: boolean = false;

  codePartsSizesFix;

  emptyArea_1_Size:number = 0;
  emptyArea_2_Size:number = 0;

  customGutter1_dragStartPos:number = 0;
  customGutter2_dragStartPos:number = 0

  isCustomGutter1_dragging: boolean = false;
  isCustomGutter2_dragging: boolean = false;


  @ViewChild("customGutter1")customGutter1:ElementRef;
  @ViewChild("customGutter2")customGutter2:ElementRef;

  @ViewChild("emptyArea1")emptyArea1:ElementRef;
  @ViewChild("emptyArea2")emptyArea2:ElementRef;

  isFiddleWidthDisabled:boolean = false;
  isFiddleHeightDisabled: boolean = false;

  fiddleTheme: FiddleTheme = {
    "name": "VS",
    "id": "vs-default",
    "data": {
        "base": "vs",
        "inherit": true,
        "rules": [],
        "colors": {
          "editor.foreground": "#000000",
          "editor.background": "#FFFFFF",
          "editor.selectionBackground": "#add6ff",
          "editor.lineHighlightBackground": "#FFFFFF",
          "editorCursor.foreground": "#000000",
          "editorWhitespace.foreground": "#000000"
      }
    }
  };

  constructor(private mainService: MainService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService) { 
  }

  ngAfterViewInit(): void {
    let self = this;
    this.IsAfterViewInitReached = true;
    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    if(mainContainerEl){
      this.mainContainerWidth = mainContainerEl.offsetWidth;
      this.mainContainerHeight = mainContainerEl.offsetHeight;
    }
     
    this.activatedRoute.paramMap.subscribe((params)=>{
      let currentFiddleId = +params.get("id");
      if(currentFiddleId){
        if(self.mainService.redirectAfterSaveMode){
          this.htmlCode = this.mainService.htmlCode;
          this.cssCode = this.mainService.cssCode;
          this.jsCode = this.mainService.jsCode;
          this.fiddleTitle = this.mainService.fiddleTitle;
          
          this.showHtml = this.mainService.showHtml;
          this.showCss = this.mainService.showCss;
          this.showJs = this.mainService.showJs;
          this.showResult = this.mainService.showResult;

          let obj = {
            cssCodePartSize: this.mainService.cssCodePartSize,
            jsCodePartSize: this.mainService.jsCodePartSize,
            htmlCodePartSize: this.mainService.htmlCodePartSize,
            mainContainerWidth: this.mainService.mainContainerWidth,
            mainContainerHeight: this.mainService.mainContainerHeight,
            codePartsSize: this.mainService.codePartsSize,
            layout: this.mainService.layout,
            iframeResizeValue: this.mainService.iframeResizeValue
          }
          this.changeLayout(this.mainService.layout, {data: obj});
          self.mainService.redirectAfterSaveMode = false;
          this.runCode();
          //this.changeFiddleTheme();
        }
        else{
          this.loader.showLoader();
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
              //
              this.mainService.jsCode = obj.js;
              this.mainService.htmlCode = obj.html;
              this.mainService.cssCode = obj.css;
              this.mainService.fiddleTitle = obj.title;
              let mobileLayoutArr = obj.mobileLayout.split(':');
              let mobileCodePart = mobileLayoutArr[0];
              let mobileResult = mobileLayoutArr[1];
              switch (true){
                case mobileCodePart == '0':
                  this.showHtml = false;
                  this.showCss = false;
                  this.showJs = false;
                break;

                case mobileCodePart == '1':
                  this.showHtml = true;
                  this.showCss = false;
                  this.showJs = false;
                break;

                case mobileCodePart == '2':
                  this.showHtml = false;
                  this.showCss = true;
                  this.showJs = false;
                break;

                case mobileCodePart == '3':
                  this.showHtml = false;
                  this.showCss = false;
                  this.showJs = true;
                break;
              }

              if(mobileResult == "0"){
                this.showResult = false;
              }
              else if(mobileResult == "1"){
                this.showResult = true;
              }

              this.mainService.showHtml = this.showHtml;
              this.mainService.showCss = this.showCss;
              this.mainService.showJs = this.showJs;
              this.mainService.showResult = this.showResult;

              this.changeLayout(parseInt(obj.layout), {data:obj});
              this.runCode();
            }
            else{
              if(obj.errorCode == "-1"){
                this.toastrService.warning("Fiddle not found.");
                this.changeLayout(1);
              }
            }
            //this.changeFiddleTheme();
          });
        }
      }
      else{
        this.changeLayout(1);
      }

      let savedThemeId = localStorage.getItem("myfiddle-theme");
      let selectedTheme: FiddleTheme;
      
      if(savedThemeId){
          selectedTheme = this.mainService.monacoThemesList.find((el)=>{return el.id == savedThemeId});
          this.fiddleTheme = selectedTheme;
      }

      this.mainService.resumeFiddleTheme();

    });

    this.splitComponentInner.dragProgress$.subscribe((res)=>{
      let sizes = this.splitComponentInner.getVisibleAreaSizes();
      this.newHtmlCodePartSize = sizes[1] as number;
      this.newCssCodePartSize = sizes[2] as number;
      this.newJsCodePartSize = sizes[3] as number;

      this.setMainServiceCodepartSizes();
      //console.log("splitComponentInner sizes = ", sizes);
    });

    this.splitComponentOuter.dragProgress$.subscribe((res)=>{
      let sizes = this.splitComponentOuter.getVisibleAreaSizes();
      if(this.layout == 1 || this.layout == 2){
        this.newCodePartSize = sizes[0] as number;
      }
      else if(this.layout == 3 || this.layout == 4){
        this.newCodePartSize = sizes[1] as number;
      }

      this.setMainServiceCodepartSizes();
      //console.log("splitComponentOuter sizes = ", sizes);
      this.calculateIframeSize(mainContainerEl);
    });

    /*this.splitComponentIframeResize.dragProgress$.subscribe((res)=>{
      this.calculateIframeSize(mainContainerEl);
      let sizes = this.splitComponentIframeResize.getVisibleAreaSizes();
      this.newIframeResizeValue = sizes[0] as number;
      this.setMainServiceCodepartSizes();
    })*/

    this.setMainServiceCodepartSizes();

    

    window.addEventListener("keydown", function(event){
      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        event.preventDefault();
        event.stopPropagation();
      }
      let evDate = new Date();
      
        if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){        
          self.runCode();
        }
        else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
          if( self.mainService.codeExecutionDate === undefined || evDate.getTime() - self.mainService.codeExecutionDate.getTime() >= 1500){
            self.runCode("save");
            self.mainService.codeExecutionDate = evDate;
          }
        }
      
    })
  }

  getIsFiddleThemeDark(){
    //return this.mainService.isFiddleThemeDark;
    let isThemeDark = this.fiddleTheme ? (this.fiddleTheme.data.base == "vs-dark" || this.fiddleTheme.data.base == "hc-black") : false;
    return isThemeDark;
  }

  selectTheme(theme: FiddleTheme){
    this.fiddleTheme = theme;
    localStorage.setItem("myfiddle-theme",theme.id);
    this.mainService.addThemeStylesheet(theme);
    this.mainService.registerMonacoCustomTheme(theme);
    this.isThemesListShown = false;
  }

  getThemesList(){
    return this.mainService.monacoThemesList;
  }

  calculateIframeSize(mainContainerEl?, sizes?){
    let self = this;
    setTimeout(()=>{
      let refElement = mainContainerEl || self.mainContainer.nativeElement || document.documentElement;
      if(sizes !== undefined){
        self.iframeHeight = sizes.height;
        self.iframeWidth = sizes.width;
      }
      else{
        self.iframeHeight = (refElement.querySelector(".as-split-area-iframe iframe") as HTMLElement).offsetHeight;
        self.iframeWidth = (refElement.querySelector(".as-split-area-iframe iframe") as HTMLElement).offsetWidth;
      }

      //console.log("self.iframeWidth = ", self.iframeWidth);
      //console.log("self.iframeHeight = ", self.iframeHeight);
    },1)
  }

  setMainServiceCodepartSizes(){
    this.mainService.htmlCodePartSize = this.newHtmlCodePartSize;
    this.mainService.cssCodePartSize = this.newCssCodePartSize;
    this.mainService.jsCodePartSize = this.newJsCodePartSize;

    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    
    if(mainContainerEl){
      this.mainService.mainContainerHeight = mainContainerEl.offsetHeight;
      this.mainService.mainContainerWidth = mainContainerEl.offsetWidth;
    }

    this.mainService.layout = this.layout;
    
    this.mainService.codePartsSize = this.newCodePartSize;
  }

  changeLayout(newLayout: number, param?: any){
      this.layout = newLayout;
      this.mainService.layout = newLayout;
      let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
      if(mainContainerEl){
        window.setTimeout(()=>{
          this.mainContainerHeight = mainContainerEl.offsetHeight;
          this.mainContainerWidth = mainContainerEl.offsetWidth;
          if (param !==undefined && param !== null) {
            this.getAndAdaptSavedCodePartsSizes(param);
          }
          else{
            this.emptyArea_1_Size = 0;
            this.emptyArea_2_Size = 0;
            switch(this.layout){
              case 1:
              this.initialCssCodePartSize = (this.mainContainerHeight - 10) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerHeight - 10) / 3;
              this.initialJsCodePartSize = (this.mainContainerHeight - 10) / 3;
              this.initialCodePartSize = 350;
              //console.log("this.mainContainerHeight = ", this.mainContainerHeight);
              
              break;
              case 2:
              this.initialCssCodePartSize = (this.mainContainerWidth - 10) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerWidth - 10) / 3;
              this.initialJsCodePartSize = (this.mainContainerWidth - 10) / 3;
              this.initialCodePartSize = 300;
              
              break;
              case 3:
              this.initialCssCodePartSize = (this.mainContainerHeight - 10) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerHeight - 10) / 3;
              this.initialJsCodePartSize = (this.mainContainerHeight - 10) / 3;
              this.initialCodePartSize = 350;
              
              break;
              case 4:
              this.initialCssCodePartSize = (this.mainContainerWidth - 10) / 3;
              this.initialHtmlCodePartSize = (this.mainContainerWidth - 10) / 3;
              this.initialJsCodePartSize = (this.mainContainerWidth - 10) / 3;
              this.initialCodePartSize = 300;
              
              break;
            }
          }
          this.newCssCodePartSize = this.initialCssCodePartSize;
          this.newHtmlCodePartSize = this.initialHtmlCodePartSize;
          this.newJsCodePartSize = this.initialJsCodePartSize;
          this.newCodePartSize = this.initialCodePartSize;
          this.splitComponentInner.setVisibleAreaSizes(["*", this.newHtmlCodePartSize , this.newCssCodePartSize , this.newJsCodePartSize]);
          
          this.calculateIframeSize(mainContainerEl);
          this.setMainServiceCodepartSizes();
        }, 1);
      }
  }

  getAndAdaptSavedCodePartsSizes(param){
    let savedLayout = parseInt(param.data.layout); 
    
    let savedCssCodePartSize = parseInt(param.data.cssCodePartSize); 
    let savedJsCodePartSize = parseInt(param.data.jsCodePartSize); 
    let savedHtmlCodePartSize = parseInt(param.data.htmlCodePartSize); 
    
    let savedMainContainerWidth = parseInt(param.data.mainContainerWidth); 
    let savedMainContainerHeight = parseInt(param.data.mainContainerHeight); 
    let savedIframeResizeValue = parseInt(param.data.iframeResizeValue);
    
    let savedMainContainerSize; 

    let savedCodePartsSize = parseInt(param.data.codePartsSize); 

    let mainContainerEl:HTMLElement = this.mainContainer.nativeElement;
    let currentMainContainerSize;
    let currentMainContainerSize2;

    let codePartsMinLimit;
    
    if(savedLayout == 1 || savedLayout == 3){
      currentMainContainerSize = mainContainerEl.offsetHeight;
      savedMainContainerSize = savedMainContainerHeight;

      currentMainContainerSize2 = mainContainerEl.offsetWidth;
      savedMainContainerSize = savedMainContainerWidth;
      codePartsMinLimit = 350;
    }
    else if(savedLayout == 2 || savedLayout == 4){
      currentMainContainerSize = mainContainerEl.offsetWidth;
      savedMainContainerSize = savedMainContainerWidth;

      currentMainContainerSize2 = mainContainerEl.offsetHeight;
      savedMainContainerSize = savedMainContainerHeight;

      codePartsMinLimit = 300;
    }

    if(savedIframeResizeValue > currentMainContainerSize - 12){
      this.emptyArea_1_Size = 0;
      this.emptyArea_2_Size = 0;
    }
    else if(savedIframeResizeValue < 0){
      this.emptyArea_1_Size = (currentMainContainerSize / 2) - 6;
      this.emptyArea_2_Size = (currentMainContainerSize / 2) - 6;
    }
    else{
      this.emptyArea_1_Size = (currentMainContainerSize - savedIframeResizeValue) / 2 - 6;
      this.emptyArea_2_Size = (currentMainContainerSize - savedIframeResizeValue) / 2 - 6;
    }

    let sizes: Array<any> = ['*', savedHtmlCodePartSize, savedCssCodePartSize, savedJsCodePartSize];
    //console.log("param.data = ", param.data);
    this.reAdaptCodePartsSizes(sizes, currentMainContainerSize - 10, "inner");
    this.initialHtmlCodePartSize = Math.floor(sizes[1]);
    this.initialCssCodePartSize = Math.floor(sizes[2]);
    this.initialJsCodePartSize = Math.floor(sizes[3]);
    /****************************************/
    let ind;
    if(savedLayout == 1 || savedLayout == 2){
      sizes = [savedCodePartsSize, "*"];
      ind = 0;
    }
    else if(savedLayout== 3 || savedLayout == 4){
      sizes = ['*', savedCodePartsSize]; 
      ind = 1;
    }

    if(savedMainContainerSize > currentMainContainerSize2){
      let coef = savedMainContainerSize / currentMainContainerSize2;
      sizes[ind] = (sizes[ind] / coef) > codePartsMinLimit ? (sizes[ind] / coef) : codePartsMinLimit;
    }
    else if(savedMainContainerSize < currentMainContainerSize2){
      let coef = currentMainContainerSize2 / savedMainContainerSize;
      sizes[ind] = sizes[ind] * coef;
    }
    this.reAdaptCodePartsSizes(sizes, currentMainContainerSize2 - 5 , "outer");
    this.initialCodePartSize = Math.floor(sizes[ind]);

  }

  getLayoutInfos(name){
    switch(name){
      case "htmlAsSplitAreaSize":
      return this.initialHtmlCodePartSize;

      case "cssAsSplitAreaSize":
      return this.initialCssCodePartSize

      case "jsAsSplitAreaSize":
      return this.initialJsCodePartSize;

      case "codePartsAsSplitAreaSize":
      return this.initialCodePartSize;
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
        return 24;

        case "cssAsSplitAreaMinSize":
        return 24;

        case "jsAsSplitAreaMinSize":
        return 24;

        case "iframeAsSplitAreaOrder":
        return 2;

        case "iframeAsSplitAreaMinSize":
        return 350;

        case "iframeAsSplitAreaSize":
        return "*";

        case "iframeResizer":
        return "vertical";
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
        return 300;

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
        return 300;

        case "iframeAsSplitAreaSize":
        return "*";

        case "iframeResizer":
        return "horizontal";
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
        return 24;

        case "cssAsSplitAreaMinSize":
        return 24;

        case "jsAsSplitAreaMinSize":
        return 24;

        case "iframeAsSplitAreaOrder":
        return 1;

        case "iframeAsSplitAreaMinSize":
        return 350;

        case "iframeAsSplitAreaSize":
        return "*";

        case "iframeResizer":
        return "vertical";
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
        return 300;

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
        return 300;

        case "iframeAsSplitAreaSize":
        return "*";

        case "iframeResizer":
        return "horizontal";
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

  toggleDonationMenu(){
    this.isDonationsListShown = !this.isDonationsListShown;
  }

  toggleThemesListMenu(){
    this.isThemesListShown = !this.isThemesListShown;
  }

  selectDonation(newIndex){
    let form = document.querySelector("#lhazlgkemjk");
    if(form){
      let select: HTMLSelectElement = form.querySelector("select[name='os0']");
      let submitBtn: HTMLButtonElement = form.querySelector("input[name='submit']")
      if(select && submitBtn){
        select.selectedIndex = newIndex;
        //console.log("select.value = ", select.value);
        submitBtn.click();
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
  }

  stretchCodePart(codePartType){
    if(this.IsAfterViewInitReached){
      if(this.layout == 1 || this.layout == 3){
        let totalSize = this.mainContainerHeight - 10;
        //console.log("totalSize = ", totalSize);
        switch(codePartType){
          case("html"):
          this.splitComponentInner.setVisibleAreaSizes(["*", (totalSize - 48), 24, 24]);
          break;
          case("css"):
          this.splitComponentInner.setVisibleAreaSizes(["*", 24, (totalSize - 48), 24]);
          break;
          case("js"):
          this.splitComponentInner.setVisibleAreaSizes(["*", 24, 24, (totalSize - 48)]);
          break;
        }
      }
      else if( this.layout == 2 || this.layout == 4){
        let totalSize = this.mainContainerWidth - 10;
        //console.log("totalSize = ", totalSize);
        switch(codePartType){
          case("html"):
          this.splitComponentInner.setVisibleAreaSizes(["*", (totalSize - 50), 25, 25]);
          break;
          case("css"):
          this.splitComponentInner.setVisibleAreaSizes(["*", 25, (totalSize - 50), 25]);
          break;
          case("js"):
          this.splitComponentInner.setVisibleAreaSizes(["*", 25, 25, (totalSize - 50)]);
          break;
        }
      }
      let sizes = this.splitComponentInner.getVisibleAreaSizes();
      this.newHtmlCodePartSize = sizes[1] as number;
      this.newCssCodePartSize = sizes[2] as number;
      this.newJsCodePartSize = sizes[3] as number;

      this.setMainServiceCodepartSizes();
    }
  }

  @HostListener("window:keydown", ["$event"])
  onWindowKeydown(event: KeyboardEvent){
    //console.log("onWindowKeydown ", event.code);
  }
  
  @HostListener("document:mouseup", ["$event"])
  onDocumentMouseup(event: MouseEvent ){
    if(this.isCustomGutter1_dragging || this.isCustomGutter2_dragging){
      event.preventDefault();
      this.showIframeHider = false;
    }
    if(this.isCustomGutter1_dragging){
      this.isCustomGutter1_dragging = false;
      //console.log("isCustomGutter1_dragging == FALSE mouseup.type event = " + event.type);
      //console.log("--------------------------");

      this.isFiddleHeightDisabled = false;
      this.isFiddleWidthDisabled = false;
    }
    else if(this.isCustomGutter2_dragging){
      this.isCustomGutter2_dragging = false;

      //console.log("isCustomGutter2_dragging == FALSE mouseup.type event = " + event.type);
      //console.log("--------------------------");

      this.isFiddleHeightDisabled = false;
      this.isFiddleWidthDisabled = false;
    }
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent){
    let evTarget = event.target as HTMLElement;
    
    let bool = !evTarget.classList.contains("themes-menu") && !evTarget.classList.contains("themes-btn") && !evTarget.parentElement.classList.contains("themes-btn");

    let bool2 = !evTarget.classList.contains("donations-menu") && !evTarget.classList.contains("paypal-btn") && !evTarget.parentElement.classList.contains("paypal-btn");

    let bool3 = !this.getDOMClosest(evTarget, ".layouts-list-container");

    if(bool){
      this.isThemesListShown = false;
    }

    if(bool2){
      this.isDonationsListShown = false;
    }

    if(bool3){
      this.isLayoutsListShown = false;
    }
  }

  @HostListener("document:touchend", ["$event"])
  onDocumentTouchend(event: MouseEvent){
    this.onDocumentMouseup(event);
  }

  @HostListener("document:mousemove", ["$event"])
  onDocumentMousemove(event: any){
    this.onAsSplitAreaIframeMousemove(event);
  }

  @HostListener("document:touchmove", ["$event"])
  onDocumentTouchmove(event: any){
    this.onAsSplitAreaIframeMousemove(event);
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize(event){
    let self = this;
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
      let newMainContainerWidthOrHeight2;
      
      if(this.layout == 1 || this.layout == 3){
        mainContainerWidthOrHeight = this.mainContainerHeight;
        newMainContainerWidthOrHeight = newMainContainerHeight;
        newMainContainerWidthOrHeight2 = newMainContainerWidth;
      }
      else{
        mainContainerWidthOrHeight = this.mainContainerWidth;
        newMainContainerWidthOrHeight = newMainContainerWidth;
        newMainContainerWidthOrHeight2 = newMainContainerHeight;
      }
      this.reAdaptIframeResizeValue(mainContainerWidthOrHeight, newMainContainerWidthOrHeight);
      /*START readapt code parts sizes*/
      let sizes: Array<any> = this.splitComponentInner.getVisibleAreaSizes();
      let sizesOuter: Array<any> = this.splitComponentOuter.getVisibleAreaSizes();
      if(newMainContainerWidthOrHeight > mainContainerWidthOrHeight){
        let coef = newMainContainerWidthOrHeight / mainContainerWidthOrHeight;
        
        sizes[1] = sizes[1] * coef;
        sizes[2] = sizes[2] * coef;
        sizes[3] = sizes[3] * coef;
      }
      else if(newMainContainerWidthOrHeight < mainContainerWidthOrHeight){
        let coef = mainContainerWidthOrHeight / newMainContainerWidthOrHeight;
        sizes[1] = (sizes[1] / coef) > 25 ? (sizes[1] / coef) : 25;
        sizes[2] = (sizes[2] / coef) > 25 ? (sizes[2] / coef) : 25;
        sizes[3] = (sizes[3] / coef) > 25 ? (sizes[3] / coef) : 25;
      }
      /*END readapt code parts sizes*/
      self.reAdaptCodePartsSizes(sizes, newMainContainerWidthOrHeight - 10, "inner");
      if(!this.codePartsSizesFix){
        this.codePartsSizesFix = setTimeout(()=>{
          self.reAdaptCodePartsSizes(sizesOuter, newMainContainerWidthOrHeight2 - 5 , "outer");    
          //console.log("here !!");
          clearTimeout(self.codePartsSizesFix);
        }, 150)
      }

      this.mainContainerHeight = newMainContainerHeight;
      this.mainContainerWidth = newMainContainerWidth;

      let newCodePartSize;
      let outerSplitterSizes;
      if(this.layout == 1 || this.layout == 3){
        if(this.newCodePartSize > this.mainContainerWidth - 5 ){
          newCodePartSize = this.mainContainerWidth - 13;
          this.newCodePartSize = newCodePartSize;
        }
        if(this.newCodePartSize < 350){
          this.newCodePartSize = 350;
        }
        
      }
      else if(this.layout == 2 || this.layout == 4){
        if(this.newCodePartSize > this.mainContainerHeight - 5 ){
          newCodePartSize = this.mainContainerHeight - 13;
          this.newCodePartSize = newCodePartSize;
        }
        if(this.newCodePartSize < 300){
          this.newCodePartSize = 300;
        }
      }

      if(this.layout == 1 || this.layout == 2){
        outerSplitterSizes = [this.newCodePartSize, "*"];
      }
      else if(this.layout== 3 || this.layout == 4){
        outerSplitterSizes = ['*', this.newCodePartSize]; 
      }

      this.splitComponentOuter.setVisibleAreaSizes(outerSplitterSizes);

      this.setMainServiceCodepartSizes();

      this.calculateIframeSize(mainContainerEl);
    }
  }
  
  /**
   * Re-adapts the iframeResizeValue on window resize or after fiddle retrieval by id
   * @param mainContainerWidthOrHeight .main-container's width or height depending on the layout
   */
  reAdaptIframeResizeValue(oldMainContainerWidthOrHeight: number, newMainContainerWidthOrHeight: number){
    //console.log("oldMainContainerWidthOrHeight = ", oldMainContainerWidthOrHeight);
    //console.log("newMainContainerWidthOrHeight = ", newMainContainerWidthOrHeight);
    //console.log("_____________________________");
    let sizeDiff = newMainContainerWidthOrHeight - oldMainContainerWidthOrHeight;
    let newEmptyAreaSize = this.emptyArea_1_Size + (sizeDiff / 2);
    if(newEmptyAreaSize < 0){
      this.emptyArea_1_Size = 0;
      this.emptyArea_2_Size = 0;
    }
    else if (newEmptyAreaSize > newMainContainerWidthOrHeight / 2 - 6){
      this.emptyArea_1_Size = newMainContainerWidthOrHeight / 2 - 6;
      this.emptyArea_2_Size = newMainContainerWidthOrHeight / 2 - 6;
    }
    else{
      this.emptyArea_1_Size = newEmptyAreaSize;
      this.emptyArea_2_Size = newEmptyAreaSize;
    }
  }

  /**
   * Corrects the width/height of each code part area when total size of code parts is not equal to mainContainerWidthOrHeight.
   * @param sizes Split Component areas sizes array
   * @param mainContainerWidthOrHeight offsetWidth or offsetHeight of .main-container
   */
  reAdaptCodePartsSizes(sizes: Array<number>, mainContainerWidthOrHeight: number, type: string){
    if(type == "inner"){
      let total = sizes[1] + sizes[2] + sizes[3];
      let keeping = true;
      if(total > mainContainerWidthOrHeight){
        do
        {
          for(let ind = 1;ind <=3; ind++){
            if((sizes[1]+sizes[2]+sizes[3]) > mainContainerWidthOrHeight){
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
      else if(total < mainContainerWidthOrHeight){
        do
        {
          for(let ind = 1;ind <=3; ind++){
            if((sizes[1]+sizes[2]+sizes[3]) < mainContainerWidthOrHeight){
              if(sizes[ind]>25){
                sizes[ind]++;
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
      //console.log("sizes inner = ", sizes);
      this.splitComponentInner.setVisibleAreaSizes(sizes);
      this.newHtmlCodePartSize = sizes[1] as number;
      this.newCssCodePartSize = sizes[2] as number;
      this.newJsCodePartSize = sizes[3] as number;
    }
    else if(type == "outer"){
      let total;
      /**Index of codeparts width value in the sizes Array of outer SplitComponent */
      let ind;
      let minLimit;
      if(this.layout == 1 || this.layout == 2){
        ind = 0;
      }
      else if(this.layout == 3 || this.layout == 4){
        ind = 1;
      }

      if(this.layout == 1 || this.layout == 3){
        minLimit = 350;
      }
      else if(this.layout == 2 || this.layout == 4){
        minLimit = 300;
      }
      
      total = sizes[ind];
      let keeping = true;
      
      if(total > mainContainerWidthOrHeight){
        do
        {
          if((sizes[ind]) > mainContainerWidthOrHeight){
            if(sizes[ind]>minLimit){
              sizes[ind]--;
            }
            else{
              sizes[ind] = minLimit;
            }
          }
          else{
            keeping = false;
            break;
          }

        }
        while(keeping);
      }
      else if(total < minLimit){
        do
        {
          if((sizes[ind]) < minLimit){
            sizes[ind]++;
          }
          else{
            keeping = false;
            break;
          }
        }
        while(keeping);
      }
      
      //console.log("sizes outer = ", sizes);
      this.newCodePartSize = sizes[ind] as number;
      this.splitComponentOuter.setVisibleAreaSizes(sizes);
    }
  }

  runCode(param?){
    if(param == "save"){
      if(window.innerWidth <= 767 || window.innerHeight <= 580 || this.mainService.iframeResizeValue === undefined){
        if(this.layout == 1 || this.layout == 3){
          this.mainService.iframeResizeValue = this.mainContainerHeight - 12;
        }
        else if(this.layout == 2 || this.layout == 4){
          this.mainService.iframeResizeValue = this.mainContainerWidth - 12;
        } 
      }
    }
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
    this.mainService.showHtml = this.showHtml;
    this.mainService.showCss = this.showCss;
    this.mainService.showJs = this.showJs;
    this.mainService.showResult = this.showResult;

    let self = this;
      //console.log("inside custom interval");
      if (!this.showCss){
        if(this.codeParts.nativeElement.querySelector(".code-component-container-css").classList.contains("hide-mobile")){
          //window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          //clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showHtml){
        if(this.codeParts.nativeElement.querySelector(".code-component-container-html").classList.contains("hide-mobile")){
          //window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          //clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showJs){
        if(this.codeParts.nativeElement.querySelector(".code-component-container-js").classList.contains("hide-mobile")){
          //window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          //clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showResult){
        if(document.querySelector("app-iframe-part").classList.contains("hide-mobile")){
          //window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          //clearInterval(editorLayoutFixInterval);
        }
      }
  }

  getEmptyAreaSize(areaNum:number){
    if(areaNum == 1){
      return this.emptyArea_1_Size + "px";
    }
    else if(areaNum == 2){
      return this.emptyArea_2_Size + "px"
    }
  }

  getIframeAreaSize(){
    if(this.IsAfterViewInitReached){
      let size = 0;
      let mainContainer = this.mainContainer.nativeElement;
        if(this.layout == 1 || this.layout == 3){
          size = this.mainContainerHeight;
        }
        else if(this.layout == 2 || this.layout == 4){
          size = this.mainContainerWidth;
        }

        return size - this.emptyArea_1_Size * 2 - 12 + 'px';
    }
    else return "0px";
  }

  onGutterCustomMousedown(event: any, customGutterNum){
    event.preventDefault();
    if(customGutterNum == 1){
      this.isCustomGutter1_dragging = true;
      this.isCustomGutter2_dragging = false;
    
      this.isFiddleHeightDisabled = true;
      this.isFiddleWidthDisabled = true;

      this.customGutter1_dragStartPos = event.type == "touchstart" ? event.touches[0].clientY : event.clientY;
      //console.log("mousedown event.type = " + event.type);
      //console.log("--------------------------");
    }
    else if(customGutterNum == 2){
      this.isCustomGutter2_dragging = true;
      this.isCustomGutter1_dragging = false;

      this.isFiddleHeightDisabled = true;
      this.isFiddleWidthDisabled = true;

      //console.log("mousedown event.type = " + event.type);
      //console.log("--------------------------");
    }
  }

  onAsSplitAreaIframeMousemove(event: any ){
    let evTarget = event.target as HTMLElement;

      if(this.IsAfterViewInitReached){
        let eventClientXOrX;
        if(event.type == "touchmove"){
          if(this.layout == 1 || this.layout == 3){
            eventClientXOrX = event.touches[0].clientY;
          }
          else if(this.layout == 2 || this.layout == 4){
            eventClientXOrX = event.touches[0].clientX;
          }
        }
        else{
          if(this.layout == 1 || this.layout == 3){
            eventClientXOrX = event.clientY;
          }
          else if(this.layout == 2 || this.layout == 4){
            eventClientXOrX = event.clientX;
          }
        }
        let emptyArea1 = this.emptyArea1.nativeElement as HTMLElement;
        let emptyArea2 = this.emptyArea2.nativeElement as HTMLElement;
        let mainContainer = this.mainContainer.nativeElement as HTMLElement;
        if(this.isCustomGutter1_dragging){
          if(!this.showIframeHider){
            this.showIframeHider = true; 
          }
          event.preventDefault();
          //console.log("mousemove evTarget = ", evTarget);
          //console.log("isCustomGutter1_dragging is true");
          if(this.layout == 1 || this.layout == 3){
            let emptyArea1_height = emptyArea1.offsetHeight;
            emptyArea1_height = eventClientXOrX - mainContainer.getBoundingClientRect().top;
            if(emptyArea1_height < 0){
              emptyArea1_height = 0;
            }
            else if(emptyArea1_height > mainContainer.offsetHeight / 2 - 6){
              emptyArea1_height = mainContainer.offsetHeight / 2 - 6;
            }
            this.emptyArea_1_Size = emptyArea1_height;
            this.emptyArea_2_Size = emptyArea1_height;
          }
          else if(this.layout == 2 || this.layout == 4){
            let emptyArea1_width = emptyArea1.offsetWidth;
            emptyArea1_width = eventClientXOrX - mainContainer.getBoundingClientRect().left;
            if(emptyArea1_width < 0){
              emptyArea1_width = 0;
            }
            else if(emptyArea1_width > mainContainer.offsetWidth / 2 - 6){
              emptyArea1_width = mainContainer.offsetWidth / 2 - 6;
            }
            this.emptyArea_1_Size = emptyArea1_width;
            this.emptyArea_2_Size = emptyArea1_width;
          }
          this.calculateIframeSize(mainContainer);
          this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
        }
        else if(this.isCustomGutter2_dragging){
          if(!this.showIframeHider){
            this.showIframeHider = true; 
          }
          event.preventDefault();
          //console.log("mousemove evTarget = ", evTarget);
          //console.log("isCustomGutter2_dragging is true");
          if(this.layout == 1 || this.layout == 3){
            let emptyArea2_height = emptyArea2.offsetHeight;
            emptyArea2_height = mainContainer.getBoundingClientRect().bottom - eventClientXOrX ;
            if(emptyArea2_height < 0){
              emptyArea2_height = 0;
            }
            else if(emptyArea2_height > mainContainer.offsetHeight / 2 - 6){
              emptyArea2_height = mainContainer.offsetHeight / 2 - 6;
            }
            this.emptyArea_2_Size = emptyArea2_height;
            this.emptyArea_1_Size = emptyArea2_height;
            //console.log("emptyArea2_height = ", emptyArea2_height);
          }
          else if(this.layout == 2 || this.layout == 4){
            let emptyArea2_width = emptyArea2.offsetWidth;
            emptyArea2_width = mainContainer.getBoundingClientRect().right - eventClientXOrX ;
            if(emptyArea2_width < 0){
              emptyArea2_width = 0;
            }
            else if(emptyArea2_width > mainContainer.offsetWidth / 2 - 6){
              emptyArea2_width = mainContainer.offsetWidth / 2 - 6;
            }
            this.emptyArea_2_Size = emptyArea2_width;
            this.emptyArea_1_Size = emptyArea2_width;
            //console.log("emptyArea2_width = ", emptyArea2_width);
          }
          this.calculateIframeSize(mainContainer);
          this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
        }
      } 
  }

  onFiddeWidthChange(data){
    let newFiddleWidth = parseInt(data);

    switch(this.layout){
      case 1:
      
      if(newFiddleWidth <= (this.mainContainerWidth - 350 - 5)){
        this.splitComponentOuter.setVisibleAreaSizes([this.mainContainerWidth - newFiddleWidth - 5, "*"]);
        this.newCodePartSize = this.mainContainerWidth - newFiddleWidth - 5;
        this.mainService.codePartsSize = this.newCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;

      case 2:

      if(newFiddleWidth > (this.mainContainerWidth - 12)){
        this.calculateIframeSize();
      }
      else if(newFiddleWidth < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 6;
        this.emptyArea_2_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 6;
      }

      break;

      case 3:

      if(newFiddleWidth <= (this.mainContainerWidth - 350 - 5)){
        this.splitComponentOuter.setVisibleAreaSizes(["*", this.mainContainerWidth - newFiddleWidth - 5]);
        this.newCodePartSize = this.mainContainerWidth - newFiddleWidth - 5;
        this.mainService.codePartsSize = this.newCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;

      case 4:

      if(newFiddleWidth > (this.mainContainerWidth - 12)){
        this.calculateIframeSize();
      }
      else if(newFiddleWidth < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 6;
        this.emptyArea_2_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 6;
      }

      break;
    }

    this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
  }

  onFiddeHeightChange(data){
    let newFiddleHeight = parseInt(data);

    switch(this.layout){
      case 1:
      
      if(newFiddleHeight > (this.mainContainerHeight - 12)){
        this.calculateIframeSize();
      }
      else if(newFiddleHeight < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 6;
        this.emptyArea_2_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 6;
      }

      break;

      case 2:

      if(newFiddleHeight <= (this.mainContainerHeight - 300 - 5)){
        this.splitComponentOuter.setVisibleAreaSizes([this.mainContainerHeight - newFiddleHeight - 5, "*"]);
        this.newCodePartSize = this.mainContainerHeight - newFiddleHeight - 5;
        this.mainService.codePartsSize = this.newCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;

      case 3:

      if(newFiddleHeight > (this.mainContainerHeight - 12)){
        this.calculateIframeSize();
      }
      else if(newFiddleHeight < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 6;
        this.emptyArea_2_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 6;
      }

      break;

      case 4:

      if(newFiddleHeight <= (this.mainContainerHeight - 300 - 5)){
        this.splitComponentOuter.setVisibleAreaSizes(["*", this.mainContainerHeight - newFiddleHeight - 5]);
        this.newCodePartSize = this.mainContainerHeight - newFiddleHeight - 5;
        this.mainService.codePartsSize = this.newCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;
    }
    this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
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
    //this.triggerResizeWithInterval(50);
    this.canChangeSplitSizes = false;
  }

  splitComponentOuterDragEnd(event){
    //console.log("splitComponentOuterDragEnd event = ", event);
    clearInterval(this.customInterval);
    this.showIframeHider = false;

    this.isFiddleHeightDisabled = false;
    this.isFiddleWidthDisabled = false;
  }

  splitComponentOuterDragStart(event){
    //console.log("splitComponentOuterDragStart event = ", event);
    //this.triggerResizeWithInterval(50);
    this.showIframeHider = true;

    this.isFiddleHeightDisabled = true;
    this.isFiddleWidthDisabled = true;
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

  changeFiddleTheme(param?){
    //console.log("param = ", param);
    this.isThemesListShown = true;
  }

  isMatch(el, match){//cross plateform Element.matches() workaround
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, match);
  }
  //
  
  getDOMClosest(elem, selector){//DOM closest ancestor speified by a CSS selector
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( this.isMatch(elem, selector) ) return elem;
    }
    return null;
  }
}