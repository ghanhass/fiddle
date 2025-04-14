import { Component, ElementRef, HostListener, ViewChild, AfterViewInit,OnInit } from '@angular/core';
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
import { FiddleData } from '../fiddle-data';
import { NgxPrettifyService } from '@smartcodelab/ngx-prettify';
import { HtmlPartComponent } from '../html-part/html-part.component';
import { CssPartComponent } from '../css-part/css-part.component';
import { JsPartComponent } from '../js-part/js-part.component';
import { FiddlesHistoryComponent } from '../fiddles-history/fiddles-history.component';
import { PastebinComponent } from '../pastebin/pastebin.component';


interface PreviousLayout{
  layout: number,
  htmlSize: number,
  cssSize: number,
  jsSize: number,
  mainContainerSize: number
}

interface CodePartStretchState{
  state: boolean,
  index: number
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

onAppModeClick() {
  this.appMode = (this.appMode == 'pastebin') ? 'fiddle' : 'pastebin';
  this.mainService.appMode = this.appMode;
}

  showHtml: boolean = true;
  showCss: boolean = false;
  showJs: boolean = false;
  showResult: boolean = true;
  showConsole: boolean = false;
  showIframeOverlay: boolean = false;
  
  isHtmlFullScreen: boolean = false;
  isCssFullScreen: boolean = false;
  isJsFullScreen: boolean = false;

  canChangeSplitSizes: boolean = true;
  windowHeight: number = window.innerHeight;
  windowWidth: number = window.innerWidth;
  previousLayout: PreviousLayout;
  codePartStretchState: CodePartStretchState = {
    state: false,
    index: -1
  }

  appMode: string;

  splitComponentInner: SplitComponent = new SplitComponent();

  splitComponentOuter: SplitComponent = new SplitComponent();;

  @ViewChild("splitComponentIframeResize") splitComponentIframeResize: SplitComponent;


  @ViewChild("mainContainer") mainContainer:ElementRef;

  @ViewChild("codePartsArea") codePartsArea:ElementRef;

  @ViewChild("htmlPart") htmlPart:HtmlPartComponent;
  @ViewChild("cssPart") cssPart:CssPartComponent;
  @ViewChild("jsPart") jsPart:JsPartComponent;
  @ViewChild("pastebinPart") pastebinPart:PastebinComponent;


  @ViewChild("iframePart") iframePart:IframePartComponent;
  @ViewChild("layout1") layout1: ElementRef;
  @ViewChild("layout2") layout2: ElementRef;
  @ViewChild("layout3") layout3: ElementRef;
  @ViewChild("layoutsList") layoutsList: ElementRef;

  @ViewChild("modal") modal: ModalComponent;
  @ViewChild("modalHistory") modalHistory: ModalComponent;
  
  @ViewChild("ressources") ressourcesComponent: RessourcesComponent;
  @ViewChild("loader")loader:LoaderComponent;

  cssCodePartTitle: HTMLElement;
  jsCodePartTitle: HTMLElement;

  isLayoutsListShown: boolean = false;

  isThemesListShown: boolean = false;
  layout: number = 1;
  fiddleTitle: string = "";

  finalHtmlCodePartSize: number = 0;
  finalCssCodePartSize: number = 0;
  finalJsCodePartSize: number = 0;
  finalCodePartSize: number = 0;


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
  canCallReAdaptCodePartsSizes: boolean = true;

  emptyArea_1_Size:number = 0;
  emptyArea_2_Size:number = 0;


  isCustomGutter1_dragging: boolean = false;
  isCustomGutter2_dragging: boolean = false;

  isMainContainerGutter_dragging: boolean = false;

  isGutter1_dragging: boolean = false;
  isGutter2_dragging: boolean = false;

  isIframeFullScreen:boolean = false;


  @ViewChild("customGutter1")customGutter1:ElementRef;
  @ViewChild("customGutter2")customGutter2:ElementRef;

  @ViewChild("emptyArea1")emptyArea1:ElementRef;
  @ViewChild("emptyArea2")emptyArea2:ElementRef;

  isFiddleWidthInputDisabled:boolean = false;
  isFiddleHeightInputDisabled: boolean = false;


  codeParthHalfStretchFirstIndex: number = 0;
  isConsoleOn: boolean = false;
  @ViewChild("appFiddlesHistory") appFiddlesHistory: FiddlesHistoryComponent;

  constructor(private mainService: MainService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private ngxPrettifyService: NgxPrettifyService) { 
      this.appMode = this.mainService.appMode;
  }

  ngOnInit(): void{
  }

  ngAfterViewInit(): void {
    if((window as any).PayPal && (window as any).PayPal.Donation){
      (window as any).PayPal.Donation.Button({
        env:'production',
        hosted_button_id:'V8U6U69Y6BLQ6',
        image: {
          src:'https://pics.paypal.com/00/s/ZGFkMWU1YzMtOGFiOS00OGFhLWFjMjEtMDkzMWU4YWE4M2Vm/file.PNG',
          alt:'Donate with PayPal button',
          title:'Donate to MyFiddle',
        }
      }).render('#donate-button');
    }
    //
    let self = this;
    this.IsAfterViewInitReached = true;
    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    this.mainContainerWidth = mainContainerEl.offsetWidth;
    this.mainContainerHeight = mainContainerEl.offsetHeight;
     
    this.activatedRoute.paramMap.subscribe((params)=>{
      let currentFiddleId = +params.get("id");
      if(this.modalHistory.isShown){
        this.hideHistoryModal();
      }
      //data retrieval
      if(currentFiddleId && !isNaN(currentFiddleId)){
        if(this.mainService.redirectAfterSaveMode){//re-retrieve data after recent save ?
          console.log("//re-retrieve data after recent save");
          //console.log("re-retrieve data after recent save ", this.mainService.htmlCode);
          this.htmlPart.code = this.mainService.htmlCode;
          this.cssPart.code = this.mainService.cssCode;
          this.jsPart.code = this.mainService.jsCode;
          this.pastebinPart.text = this.mainService.pastebinText;
          this.appMode = this.mainService.appMode
          
          this.fiddleTitle = this.mainService.fiddleTitle;
          
          this.showHtml = this.mainService.showHtml;
          this.showCss = this.mainService.showCss;
          this.showJs = this.mainService.showJs;
          this.showResult = this.mainService.showResult;

          let obj: FiddleData = {
            css_part_size: this.mainService.cssCodePartSize,
            js_part_size: this.mainService.jsCodePartSize,
            html_part_size: this.mainService.htmlCodePartSize,
            main_container_width: this.mainService.mainContainerWidth,
            main_container_height: this.mainService.mainContainerHeight,
            code_parts_size: this.mainService.codePartsSize,
            layout: this.mainService.layout,
            iframe_resize_value: this.mainService.iframeResizeValue,
            css_code_position_data: this.mainService.cssCodePositionData,
            html_code_position_data: this.mainService.htmlCodePositionData,
            js_code_position_data: this.mainService.jsCodePositionData,
            is_mobile_mode: this.mainService.isMobileMode,
            created_at: this.mainService.fiddleCreatedAt
          }
          this.changeLayout(this.mainService.layout, obj);
          
          self.mainService.redirectAfterSaveMode = false;
          
          setTimeout(()=>{
            self.mainService.retrieveCodePartsCursors(self.cssPart, self.htmlPart, self.jsPart);        
          }, 1);

          //console.log("after router path change");
          if(this.mainService.scheduledRunFiddle){
            this.runCode();
          }

          this.mainService.isFirstTimeFiddle = false;
        }
        else{//retrieve data from backend ?
          console.log("//retrieve data from backend");
          this.loader.showLoader();
          this.mainService.getFiddle(currentFiddleId).subscribe((res)=>{
            //console.log("getFiddle res = ", res);
            if(res.status == "ok"){
              let fiddleData: FiddleData = res.fiddleData;
              //console.log("getFiddle obj = ", obj);
              this.htmlPart.code = fiddleData.html;
              this.cssPart.code = fiddleData.css;
              this.jsPart.code = fiddleData.js;
              this.pastebinPart.text = fiddleData.pastebintext;

              this.fiddleTitle = fiddleData.title;
              //
              this.mainService.jsCode = fiddleData.js;
              this.mainService.htmlCode = fiddleData.html;
              this.mainService.cssCode = fiddleData.css;
              this.mainService.fiddleTitle = fiddleData.title;
              this.mainService.iframeResizeValue = fiddleData.iframe_resize_value;
              this.mainService.cssCodePositionData = fiddleData.css_code_position_data;
              this.mainService.htmlCodePositionData = fiddleData.html_code_position_data;
              this.mainService.jsCodePositionData = fiddleData.js_code_position_data;
              this.mainService.isMobileMode = fiddleData.is_mobile_mode;
              
              this.appMode = fiddleData.appmode || 'fiddle';


              if(this.mainService.isMobileMode){
                this.changeLayout(1);

                //START mobile layout retrieval
                let mobileLayoutArr = fiddleData.mobile_layout.split(':');
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
                //END mobile layout retrieval
              }
              else{
                this.changeLayout(fiddleData.layout, fiddleData);
              }
              this.mainService.scheduledRunFiddle = true;
              this.runCode();
              setTimeout(()=>{
                self.mainService.retrieveCodePartsCursors(self.cssPart, self.htmlPart, self.jsPart, true);        
              }, 1);
            }
            else if(res.status == "not found"){
              this.toastrService.warning("Fiddle not found.");
              this.changeLayout(1);
              this.loader.hideLoader();
            }
          });
          this.mainService.isFirstTimeFiddle = false;
        }
      }
      else{
        this.changeLayout(1);
      }

      this.mainService.resumeFiddleTheme(this.htmlPart, this.cssPart, this.jsPart, this.pastebinPart);

    });

    /*
    this.splitComponentInner.dragProgress$.subscribe((res)=>{
      let sizes = this.splitComponentInner._alignedVisibleAreasSizes();
      //console.log('drag sizes = ', sizes);
      //console.log('drag res.sizes = ', res.sizes);
      this.newHtmlCodePartSize = res.sizes[1] as number;
      this.newCssCodePartSize = res.sizes[2] as number;
      this.newJsCodePartSize = res.sizes[3] as number;

      this.setMainServiceCodepartSizes();
      //console.log("splitComponentInner sizes = ", sizes);
      this.codePartStretchState.state = false;
      this.codePartStretchState.index = -1;
      this.previousLayout = undefined;
    });

    this.splitComponentOuter.dragProgress$.subscribe((res)=>{
      let sizes = this.splitComponentOuter._alignedVisibleAreasSizes();
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
    */

    this.setMainServiceCodepartSizes();

    
    window.addEventListener("keydown", function(event){
      //console.log("vanilla keydown");
      if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
        event.preventDefault();
        event.stopPropagation();
      }
      let evDate = new Date();
      
        if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code == "Enter" || event.code == "NumpadEnter")){        
          event.preventDefault();
          //event.stopPropagation();
          self.runCode();
        }
        else if((window.navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey) && (event.code  == "KeyS")){
          event.preventDefault();
          //event.stopPropagation();
          if( self.mainService.codeSavingDate === undefined || evDate.getTime() - self.mainService.codeSavingDate.getTime() >= 1500){
            //self.runCode("save");
            (document.querySelector(".share-code-btn.btn") as HTMLElement).click();//meh a workaround for calling runCode("save")
            self.mainService.codeSavingDate = evDate;
          }
        }
      
    });
  }

  switchToPastebin(){

  }

  switchToFiddle(){

  }

  isConsoleOnUpdate(newValue: boolean){
    this.isConsoleOn = newValue;
  }

  /**
   * Checks if the current theme is dark
   * @returns boolean: true if the current theme is dark or false otherwise
   */
  isFiddleThemeDark(): boolean{
    //return this.mainService.isFiddleThemeDark;
    let isThemeDark = this.mainService.selectedTheme ? (this.mainService.selectedTheme.data.base == "vs-dark") : false;
    return isThemeDark;
  }

  prettifyCode(type): void{
    switch(type){
      case 'html':
      let prettifiedHtml = this.ngxPrettifyService.prettify(this.mainService.htmlCode.trim());
      this.htmlPart.code = prettifiedHtml;
      break;

      case 'css':
        let alteredCss: string = "<style>"+this.mainService.cssCode+"</style>";
        let prettifiedCss: string = this.ngxPrettifyService.prettify(alteredCss, "css");
        let indStyle = prettifiedCss.lastIndexOf("</style>");
        prettifiedCss = prettifiedCss.slice(7,indStyle).trim();
        this.cssPart.code = prettifiedCss;
      break;

      case 'js':
        let alternateJs: string = "<script>"+this.mainService.jsCode+"</script>";
        let prettifiedJs: string = this.ngxPrettifyService.prettify(alternateJs, "javascript");
        let indScript = prettifiedJs.lastIndexOf("</script>");
        prettifiedJs = prettifiedJs.slice(8,indScript).trim();
        this.jsPart.code = prettifiedJs;
      break;
    }
  }

  selectTheme(theme: FiddleTheme){
    if(theme.id != this.mainService.selectedTheme.id){
      this.mainService.selectedTheme = theme;
      localStorage.setItem("myfiddle-theme",theme.id);
      this.mainService.addThemeStylesheet(theme);
      this.isThemesListShown = false;
    }
  }

  getIframeOrHeaderStyleObject(param ){
    let iframeHeaderStyleObject = {
      'display': param == 'header' ? (this.isIframeFullScreen ? '':'none') : '',
      'background-color': this.mainService.selectedTheme.data.colors["editor.background"],
      'color': this.mainService.selectedTheme.data.colors["editor.foreground"],
      'border-bottom': param == 'header' ? '1px solid '+this.mainService.selectedTheme.data.colors["editor.selectionBackground"] : '',
      'flex':  param == 'iframe' ?('0 0 '+this.getIframeAreaSize()) : ''
    }
    return iframeHeaderStyleObject;
  }

  getThemesList(){
    return this.mainService.themesList;
  }

  calculateIframeSize(mainContainerEl?: HTMLElement, sizes?:any){
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
    this.mainService.htmlCodePartSize = this.finalHtmlCodePartSize;
    this.mainService.cssCodePartSize = this.finalCssCodePartSize;
    this.mainService.jsCodePartSize = this.finalJsCodePartSize;

    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    
    if(mainContainerEl){
      this.mainService.mainContainerHeight = mainContainerEl.offsetHeight;
      this.mainService.mainContainerWidth = mainContainerEl.offsetWidth;
    }

    this.mainService.layout = this.layout;
    
    this.mainService.codePartsSize = this.finalCodePartSize;
  }

  changeLayout(newLayout: number, param?: FiddleData){
    let self = this;
      this.layout = newLayout;
      this.mainService.layout = newLayout;
      let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
      if(mainContainerEl){
        window.setTimeout(()=>{
          self.mainContainerHeight = mainContainerEl.offsetHeight;
          self.mainContainerWidth = mainContainerEl.offsetWidth;
          
          if (param !==undefined && param !== null) {//backend data retrieval
            self.getAndAdaptSavedCodePartsSizes(param);
          }
          else{//new fiddle
            self.emptyArea_1_Size = 0;
            self.emptyArea_2_Size = 0;
            self.mainService.iframeResizeValue = parseInt(self.getIframeAreaSize());
            switch(self.layout){
              case 1:
                this.finalCodePartSize = 300;

                this.finalHtmlCodePartSize = this.mainContainerHeight/3 + 5;
                this.finalCssCodePartSize = this.mainContainerHeight/3 + 5
                this.finalJsCodePartSize = this.mainContainerHeight/3;
              //console.log("self.mainContainerHeight = ", self.mainContainerHeight);
              
              break;
              case 2:
                this.finalCodePartSize = 300;

                this.finalHtmlCodePartSize = this.mainContainerWidth/3 + 5;
                this.finalCssCodePartSize = this.mainContainerWidth/3 + 5;
                this.finalJsCodePartSize = this.mainContainerWidth/3;
              
              break;
              case 3:
                this.finalCodePartSize = 300;

                this.finalHtmlCodePartSize = this.mainContainerHeight/3 + 5;
                this.finalCssCodePartSize = this.mainContainerHeight/3 + 5;
                this.finalJsCodePartSize = this.mainContainerHeight/3;
              
              break;
              case 4:
                this.finalCodePartSize = 300;

                this.finalHtmlCodePartSize = this.mainContainerWidth/3 + 5;
                this.finalCssCodePartSize = this.mainContainerWidth/3 + 5;
                this.finalJsCodePartSize = this.mainContainerWidth/3;
              
              break;
            }
          }

          self.newCssCodePartSize = self.initialCssCodePartSize;
          self.newHtmlCodePartSize = self.initialHtmlCodePartSize;
          self.newJsCodePartSize = self.initialJsCodePartSize;
          self.newCodePartSize = self.initialCodePartSize;
          
          self.splitComponentInner._alignedVisibleAreasSizes.apply(self.splitComponentInner, ["*", self.newHtmlCodePartSize , self.newCssCodePartSize , self.newJsCodePartSize])
          
          self.calculateIframeSize(mainContainerEl);
          self.setMainServiceCodepartSizes();
        });
      }
  }

  getAndAdaptSavedCodePartsSizes(param: FiddleData){
    let savedLayout = param.layout; 
    
    let savedCssCodePartSize = param.css_part_size; 
    let savedJsCodePartSize = param.js_part_size; 
    let savedHtmlCodePartSize = param.html_part_size; 
    
    let savedMainContainerWidth = param.main_container_width; 
    let savedMainContainerHeight = param.main_container_height; 
    let savedIframeResizeValue = param.iframe_resize_value;
    
    let savedMainContainerSize;
    let savedMainContainerSize2; 

    let savedCodePartsSize = param.code_parts_size;

    let mainContainerEl:HTMLElement = this.mainContainer.nativeElement;
    let currentMainContainerSize;
    let currentMainContainerSize2;

    let codePartsMinLimit;
    
    if(savedLayout == 1 || savedLayout == 3){
      currentMainContainerSize = mainContainerEl.offsetHeight;
      savedMainContainerSize = savedMainContainerHeight;

      currentMainContainerSize2 = mainContainerEl.offsetWidth;
      savedMainContainerSize2 = savedMainContainerWidth;
      codePartsMinLimit = 350;
    }
    else if(savedLayout == 2 || savedLayout == 4){
      currentMainContainerSize = mainContainerEl.offsetWidth;
      savedMainContainerSize = savedMainContainerWidth;

      currentMainContainerSize2 = mainContainerEl.offsetHeight;
      savedMainContainerSize2 = savedMainContainerHeight;

      codePartsMinLimit = 300;
    }

    //console.log("savedMainContainerSize = ", savedMainContainerSize);
    
    if(savedIframeResizeValue > currentMainContainerSize - 10 || savedIframeResizeValue == (savedMainContainerSize - 10)){ //custom glutters stretched ?
      //console.log("aaa");
      this.emptyArea_1_Size = 0;
      this.emptyArea_2_Size = 0;
    }
    else if(savedIframeResizeValue < 0){ //custom glutters in contact ?
      //console.log("bbb");
      this.emptyArea_1_Size = (currentMainContainerSize / 2) - 5;
      this.emptyArea_2_Size = (currentMainContainerSize / 2) - 5;
    }
    else{//retrieve custom glutter positions
      //console.log("ccc");
      this.emptyArea_1_Size = (currentMainContainerSize - savedIframeResizeValue) / 2 - 5;
      this.emptyArea_2_Size = (currentMainContainerSize - savedIframeResizeValue) / 2 - 5;
    }

    this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
    let sizes: Array<any> = ['*', savedHtmlCodePartSize, savedCssCodePartSize, savedJsCodePartSize];
    //console.log("param.data = ", param.data);
    this.reAdaptCodePartsSizes(sizes, currentMainContainerSize - 10, "inner", savedMainContainerSize);
    this.initialHtmlCodePartSize = Math.floor(sizes[1]);
    this.initialCssCodePartSize = Math.floor(sizes[2]);
    this.initialJsCodePartSize = Math.floor(sizes[3]);
    /****************************************/
    /*START readapt saved sizes to new window size*/
    let ind;
    if(savedLayout == 1 || savedLayout == 2){
      sizes = [savedCodePartsSize, "*"];
      ind = 0;
    }
    else if(savedLayout== 3 || savedLayout == 4){
      sizes = ['*', savedCodePartsSize]; 
      ind = 1;
    }

    if(savedMainContainerSize > currentMainContainerSize2){//main container size is shrinked ?
      let coef = savedMainContainerSize2 / currentMainContainerSize2;
      sizes[ind] = (sizes[ind] / coef) > codePartsMinLimit ? (sizes[ind] / coef) : codePartsMinLimit;
    }
    else if(savedMainContainerSize2 < currentMainContainerSize2){//main container size got bigger ?
      let coef = currentMainContainerSize2 / savedMainContainerSize2;
      sizes[ind] = sizes[ind] * coef;
    }
    this.reAdaptCodePartsSizes(sizes, currentMainContainerSize2 - 5, "outer", savedMainContainerSize2);
    this.initialCodePartSize = Math.floor(sizes[ind]);
    /*END readapt saved sizes to new window size*/
  }

  getLayoutInfos(name){
    switch(name){
      case "htmlAsSplitAreaSize":
      return this.finalHtmlCodePartSize+"px";;

      case "cssAsSplitAreaSize":
      return this.finalCssCodePartSize+"px";

      case "jsAsSplitAreaSize":
      return this.finalJsCodePartSize+"px";;

      case "codePartsAsSplitAreaSize":
      return this.finalCodePartSize+"px";;
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

        case "iframeAsSplitAreaOrder":
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

        //case "iframeAsSplitAreaMinSize":
        //return 350;

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
        
        case "iframeAsSplitAreaOrder":
        return 2

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

        //case "iframeAsSplitAreaMinSize":
        //return 300;

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

        case "iframeAsSplitAreaOrder":
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

        //case "iframeAsSplitAreaMinSize":
        //return 350;

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

        case "iframeAsSplitAreaOrder":
        return 1

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

        //case "iframeAsSplitAreaMinSize":
        //return 300;

        case "iframeAsSplitAreaSize":
        return "*";

        case "iframeResizer":
        return "horizontal";
      }
      break;
    }
  }

  toggleLayoutsList(){
      let layout1Element: HTMLElement = this.layout1.nativeElement;
      if(layout1Element){
        let layout1Height = layout1Element.offsetHeight;
        let layoutsListElement: HTMLElement = this.layoutsList.nativeElement;
        if(layoutsListElement){
          this.isLayoutsListShown = !this.isLayoutsListShown;
        }
        //console.log("layout1Element.offsetHeight = ", layout1Element.offsetHeight)
      }
  }

  changeTheme(){
   let isLightTeme = !this.isFiddleThemeDark()
   let ind = isLightTeme ? 1 : 0;

   if(ind === 0){
    this.htmlPart.theme = "cloud9_day";
    this.cssPart.theme = "cloud9_day";
    this.jsPart.theme = "cloud9_day";
    this.pastebinPart.theme = "cloud9_day";
   }
   else{
    this.htmlPart.theme = "cloud9_night";
    this.cssPart.theme = "cloud9_night";
    this.jsPart.theme = "cloud9_night";
    this.pastebinPart.theme = "cloud9_night";
   }

   this.selectTheme(this.mainService.themesList[ind]);
   this.iframePart.changeConsoleTheme();
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

  toggleIframeFullscreen(){
    this.isIframeFullScreen = !this.isIframeFullScreen;
  }
  
  stretchVertically(){
    if(this.layout == 1 || this.layout == 3){
      this.emptyArea_1_Size = 0;
      this.emptyArea_2_Size = 0;
      this.mainService.iframeResizeValue = this.mainContainerWidth - 10;
    }
    else if(this.layout == 2){
      this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter, [300, "*"]);
      this.mainService.codePartsSize = 300;
    }
    else if(this.layout == 4){
      this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter, ["*", 300]);
      this.mainService.codePartsSize = 300;
    }
    this.calculateIframeSize();
  }

  stretchHorizontally(){
    if(this.layout == 1){
      this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter, [350, "*"]),
      this.mainService.codePartsSize = 350;
    }

    else if(this.layout == 3){
      this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter, ["*", 350]);
      this.mainService.codePartsSize = 350;
    }
    else{
      this.emptyArea_1_Size = 0;
      this.emptyArea_2_Size = 0;
      this.mainService.iframeResizeValue = this.mainContainerWidth - 10;
    }
    this.calculateIframeSize();
  }

  resetCodePartsSize(){
    if(this.IsAfterViewInitReached){
      this.codePartStretchState.state = false;
      this.codePartStretchState.index = -1;
      this.previousLayout = undefined;

      if(this.layout == 1 || this.layout == 3){
        this.initialCssCodePartSize = (this.mainContainerHeight - 10) / 3;
        this.initialHtmlCodePartSize = (this.mainContainerHeight - 10) / 3;
        this.initialJsCodePartSize = (this.mainContainerHeight - 10) / 3;
      }
      else{
        this.initialCssCodePartSize = (this.mainContainerWidth - 10) / 3;
        this.initialHtmlCodePartSize = (this.mainContainerWidth - 10) / 3;
        this.initialJsCodePartSize = (this.mainContainerWidth - 10) / 3;
      }

      this.newCssCodePartSize = this.initialCssCodePartSize;
      this.newHtmlCodePartSize = this.initialHtmlCodePartSize;
      this.newJsCodePartSize = this.initialJsCodePartSize;

      let sizesArr: any = ["*", this.newHtmlCodePartSize,this.newCssCodePartSize, this.newJsCodePartSize];
      this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, sizesArr);
    }
  }

  halfStretchCodePart(newIndex: number, event:MouseEvent){
    let currentCodePartTitle:HTMLElement = (event.target as HTMLElement).closest(".code-part-title");

    document.querySelectorAll(".code-part-title [class*='half-stretch-btn']").forEach((el)=>{
      el.classList.add("clinging");
    });

    if(!this.codeParthHalfStretchFirstIndex){//first marking ? stretch
      this.codeParthHalfStretchFirstIndex = newIndex;
      currentCodePartTitle.classList.add("half-stretch-mark");
    }
    else if(this.codeParthHalfStretchFirstIndex == newIndex){//first marked codePart is marked again ? remove stretch
      this.codeParthHalfStretchFirstIndex = undefined;
      currentCodePartTitle.classList.remove("half-stretch-mark");

      document.querySelectorAll(".code-part-title [class*='half-stretch-btn']").forEach((el)=>{
        el.classList.remove("clinging");
      });
    }
    else{//second codePart is the one marked? proceed with resizing the first and second marked codeParts
      let mainContainerSize = (this.layout == 1 || this.layout == 3) ? this.mainContainerHeight : this.mainContainerWidth;
      let minCodePartSize = (this.layout == 1 || this.layout == 3) ? 24 : 25;
      
      let arr:any = ["*", minCodePartSize, minCodePartSize, minCodePartSize];

      arr[this.codeParthHalfStretchFirstIndex] = mainContainerSize/2 - 5 - minCodePartSize/2;
      arr[newIndex] = mainContainerSize/2 - 5 - minCodePartSize/2;


      this.finalHtmlCodePartSize = arr[1];
      this.finalCssCodePartSize = arr[2];
      this.finalJsCodePartSize = arr[3];

      this.setMainServiceCodepartSizes();

      //console.log("arr = ", arr);

      this.codeParthHalfStretchFirstIndex = undefined; //codeParthHalfStretchFirstIndex not needed anymore

      //reset stretched codepart state as well
      this.codePartStretchState.state = false;
      this.codePartStretchState.index = -1;

      let firstMarkedCodePart: HTMLElement = (this.codePartsArea.nativeElement as HTMLElement).querySelector(".half-stretch-mark");
      firstMarkedCodePart.classList.remove("half-stretch-mark");
      firstMarkedCodePart.classList.add("marking-half-stretched-code-part");
      currentCodePartTitle.classList.add("marking-half-stretched-code-part");
      
      setTimeout(()=>{
        firstMarkedCodePart.classList.remove("marking-half-stretched-code-part");
        currentCodePartTitle.classList.remove("marking-half-stretched-code-part");
      },510);

      document.querySelectorAll(".code-part-title [class*='half-stretch-btn']").forEach((el)=>{
        el.classList.remove("clinging");
      });
    }
  }

  stretchCodePart(codePartType, index?){
    if(this.IsAfterViewInitReached){
      let mainContainerEl = this.mainContainer.nativeElement as HTMLElement;
      let mainContainerSize = this.layout == 1 || this.layout == 3 ? mainContainerEl.offsetHeight : mainContainerEl.offsetWidth;
      let sizes: any[] = [];

      if(this.codePartStretchState.state && index == this.codePartStretchState.index){//codepart already stretched ? resume last codepart size
          this.codePartStretchState.state = false;
          this.codePartStretchState.index = -1;
          sizes = ["*",this.previousLayout.htmlSize, this.previousLayout.cssSize, this.previousLayout.jsSize];
          //console.log("sizes before = ", sizes);
          this.reAdaptCodePartsSizes(sizes, mainContainerSize - 10, "inner");
          //console.log("sizes after = ", sizes);

          this.finalHtmlCodePartSize = sizes[1];
          this.finalCssCodePartSize = sizes[2];
          this.finalJsCodePartSize = sizes[3];
      }
      else{//code part not stretched ? stretch it
        this.previousLayout = {
          layout: this.layout,
          htmlSize: this.finalHtmlCodePartSize,
          cssSize: this.finalCssCodePartSize,
          jsSize: this.finalJsCodePartSize,
          mainContainerSize: mainContainerSize
        }
        this.codePartStretchState.state = true;
        this.codePartStretchState.index = index;
        
        if(this.layout == 1 || this.layout == 3){
          let totalSize = this.mainContainerHeight - 10;
          //console.log("totalSize = ", totalSize);
          switch(codePartType){
            case("html"):
            this.finalHtmlCodePartSize = totalSize - 48;
            this.finalJsCodePartSize = 24;
            this.finalCssCodePartSize = 24;
            //this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, ["*", (totalSize - 48), 24, 24]);
            break;
            case("css"):
            this.finalHtmlCodePartSize = 24;
            this.finalJsCodePartSize = 24;
            this.finalCssCodePartSize = totalSize - 48;
            //this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, ["*", 24, (totalSize - 48), 24]);
            break;
            case("js"):
            this.finalHtmlCodePartSize = 24;
            this.finalJsCodePartSize = totalSize - 48;
            this.finalCssCodePartSize = 24;
            //this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, ["*", 24, 24, (totalSize - 48)]);
            break;
          }
        }
        else if( this.layout == 2 || this.layout == 4){
          let totalSize = this.mainContainerWidth - 10;
          //console.log("totalSize = ", totalSize);
          switch(codePartType){
            case("html"):
            this.finalHtmlCodePartSize = totalSize - 50;
            this.finalJsCodePartSize = 25;
            this.finalCssCodePartSize = 25;
            //this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, ["*", (totalSize - 50), 25, 25]);
            break;
            case("css"):
            this.finalHtmlCodePartSize = 25;
            this.finalJsCodePartSize = 25;
            this.finalCssCodePartSize = totalSize - 50;
            //this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, ["*", 25, (totalSize - 50), 25]);
            break;
            case("js"):
            this.finalHtmlCodePartSize = 25;
            this.finalJsCodePartSize = totalSize - 50;
            this.finalCssCodePartSize = 25;
            //this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner, ["*", 25, 25, (totalSize - 50)]);
            break;
          }
        }

        //let sizes = this.splitComponentInner._alignedVisibleAreasSizes();
        this.initialHtmlCodePartSize = sizes[1] as number;
        this.initialCssCodePartSize = sizes[2] as number;
        this.initialJsCodePartSize = sizes[3] as number;
        this.newHtmlCodePartSize = sizes[1] as number;
        this.newCssCodePartSize = sizes[2] as number;
        this.newJsCodePartSize = sizes[3] as number;
      }

      this.setMainServiceCodepartSizes();
    }
  }

  @HostListener("window:keydown", ["$event"])
  onWindowKeydown(event: KeyboardEvent){
    //console.log("onWindowKeydown ", event.code);
  }
  
  @HostListener("document:mouseup", ["$event"])
  onDocumentMouseup(event: MouseEvent ){
    if(this.isCustomGutter1_dragging || this.isCustomGutter2_dragging || this.isMainContainerGutter_dragging){
      event.preventDefault();
      this.showIframeOverlay = false;
    }
    if(this.isMainContainerGutter_dragging){
      this.isMainContainerGutter_dragging = false;
    }
    else if(this.isCustomGutter1_dragging){
      this.isCustomGutter1_dragging = false;
      //console.log("isCustomGutter1_dragging == FALSE mouseup.type event = " + event.type);
      //console.log("--------------------------");
    }
    else if(this.isCustomGutter2_dragging){
      this.isCustomGutter2_dragging = false;
      //console.log("isCustomGutter2_dragging == FALSE mouseup.type event = " + event.type);
      //console.log("--------------------------");
    }

    else if(this.isGutter1_dragging){
      this.isGutter1_dragging = false;
      //console.log("isCustomGutter1_dragging == FALSE mouseup.type event = " + event.type);
      //console.log("--------------------------");
    }
    else if(this.isCustomGutter2_dragging){
      this.isCustomGutter2_dragging = false;
      //console.log("isCustomGutter2_dragging == FALSE mouseup.type event = " + event.type);
      //console.log("--------------------------");
    }

    this.isFiddleHeightInputDisabled = false;
      this.isFiddleWidthInputDisabled = false;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent){
    let evTarget = event.target as HTMLElement;
    if (evTarget.parentElement){

      let bool = !this.getDOMClosest(evTarget, ".layouts-list-container");

      if(bool){
        this.isLayoutsListShown = false;
      }
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
    let mainContainerEl: HTMLElement = this.mainContainer.nativeElement;
    let newWindowWidth = window.innerWidth;
    let newWindowHeight = window.innerHeight;
    this.iframePart.switchConsoleMobileMode();
    
    //(new windowHeight or new windowWidth) and canChangeSplitSizes and mainContainerEl is truthy ?
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
      let oldMainContainerWidthOrHeight;
      let newMainContainerWidthOrHeight;
      let newMainContainerWidthOrHeight2;
      let iframeSize;
      
      if(this.layout == 1 || this.layout == 3){
        oldMainContainerWidthOrHeight = this.mainContainerHeight;
        newMainContainerWidthOrHeight = newMainContainerHeight;
        newMainContainerWidthOrHeight2 = newMainContainerWidth;
        iframeSize = this.iframeHeight;
      }
      else{
        oldMainContainerWidthOrHeight = this.mainContainerWidth;
        newMainContainerWidthOrHeight = newMainContainerWidth;
        newMainContainerWidthOrHeight2 = newMainContainerHeight;
        iframeSize = this.iframeWidth;
      }
      /*START readapt code parts sizes*/
      let sizes: Array<any> = this.splitComponentInner._alignedVisibleAreasSizes();
      let sizesOuter: Array<any> = this.splitComponentOuter._alignedVisibleAreasSizes();
      if(newMainContainerWidthOrHeight > oldMainContainerWidthOrHeight){
        let coef = newMainContainerWidthOrHeight / oldMainContainerWidthOrHeight;
        
        sizes[1] = sizes[1] * coef;
        sizes[2] = sizes[2] * coef;
        sizes[3] = sizes[3] * coef;
      }
      else if(newMainContainerWidthOrHeight < oldMainContainerWidthOrHeight){
        let coef = oldMainContainerWidthOrHeight / newMainContainerWidthOrHeight;
        sizes[1] = (sizes[1] / coef) > 25 ? (sizes[1] / coef) : 25;
        sizes[2] = (sizes[2] / coef) > 25 ? (sizes[2] / coef) : 25;
        sizes[3] = (sizes[3] / coef) > 25 ? (sizes[3] / coef) : 25;
      }
      /*END readapt code parts sizes*/
       
      //console.log("this.canCallReAdaptCodePartsSizes = ", this.canCallReAdaptCodePartsSizes);
      if(this.canCallReAdaptCodePartsSizes){
        this.canCallReAdaptCodePartsSizes = false;
        this.codePartsSizesFix = setTimeout(()=>{
          self.reAdaptIframeResizeValue(oldMainContainerWidthOrHeight, newMainContainerWidthOrHeight, iframeSize);   
          
          //self.codePartsSizesFix = undefined;
          self.canCallReAdaptCodePartsSizes = true;
        }, 50)
      }

      self.reAdaptCodePartsSizes(sizes, newMainContainerWidthOrHeight - 10, "inner", oldMainContainerWidthOrHeight);
      self.reAdaptCodePartsSizes(sizesOuter, newMainContainerWidthOrHeight2 - 5 , "outer", oldMainContainerWidthOrHeight); 

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

      this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter, outerSplitterSizes);

      this.setMainServiceCodepartSizes();

      this.calculateIframeSize(mainContainerEl);
    }
  }
  
  /**
   * Re-adapts the iframeResizeValue on window resize or after fiddle retrieval by id
   * @param mainContainerWidthOrHeight .main-container-fiddle's width or height depending on the layout
   */
  reAdaptIframeResizeValue(oldMainContainerWidthOrHeight: number, newMainContainerWidthOrHeight: number, iframeSize: number){
    //console.log("oldMainContainerWidthOrHeight = ", oldMainContainerWidthOrHeight);
    //console.log("iframeSize with gutters = ", iframeSize + 10);
    //console.log("_____________________________");
    let sizeDiff = newMainContainerWidthOrHeight - oldMainContainerWidthOrHeight;
    let newEmptyAreaSize = this.emptyArea_1_Size + (sizeDiff / 2);
    
      if(this.emptyArea_1_Size && this.emptyArea_2_Size){//emptyArea sizes are not 0 ? readapt them
        if(newEmptyAreaSize <= 0){
          this.emptyArea_1_Size = 0;
          this.emptyArea_2_Size = 0;
        }
        else if (newEmptyAreaSize > newMainContainerWidthOrHeight / 2 - 5){
          this.emptyArea_1_Size = newMainContainerWidthOrHeight / 2 - 5;
          this.emptyArea_2_Size = newMainContainerWidthOrHeight / 2 - 5;
        }
        else{
          this.emptyArea_1_Size = newEmptyAreaSize;
          this.emptyArea_2_Size = newEmptyAreaSize;
        }
      }
      // otherwise keep emptyArea sizes 0 if they are already 0
    
  }

  /**
   * Corrects the width/height of each code part area when total size of code parts is not equal to newMainContainerWidthOrHeight.
   * @param sizes Split Component areas sizes array
   * @param newMainContainerWidthOrHeight offsetWidth or offsetHeight of .main-container-fiddle
   */
  reAdaptCodePartsSizes(sizes: Array<number>, newMainContainerWidthOrHeight: number, type: string, oldMainContainerWidthOrHeight ? : number){
    if(type == "inner"){
      let total = sizes[1] + sizes[2] + sizes[3];
      let coef;
      
      coef = newMainContainerWidthOrHeight / total;
      
      sizes[1] = sizes[1]*coef;
      sizes[2] = sizes[2]*coef;
      sizes[3] = sizes[3]*coef;
      
      //console.log("sizes inner = ", sizes);
      this.splitComponentInner._alignedVisibleAreasSizes.apply(this.splitComponentInner,  sizes );
      this.newHtmlCodePartSize = sizes[1] as number;
      this.newCssCodePartSize = sizes[2] as number;
      this.newJsCodePartSize = sizes[3] as number;
    }
    else if(type == "outer"){
      let ind;

      if(this.layout == 1 || this.layout == 2){
        ind = 0;
      }
      else if(this.layout == 3 || this.layout == 4){
        ind = 1;
      }

      let minLimit;

      if(this.layout == 1 || this.layout == 3){
        minLimit = 350;
      }
      else if(this.layout == 2 || this.layout == 4){
        minLimit = 300;
      }

      let total = sizes[ind];
      
      if(total > newMainContainerWidthOrHeight){
        sizes[ind] = newMainContainerWidthOrHeight;
      }
      else if(total < minLimit){
        sizes[ind] = minLimit;
      }
      
      //console.log("sizes outer = ", sizes);
      this.newCodePartSize = sizes[ind] as number;
      this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter,  sizes );
    }
  }

  runCode(param?){
    this.loader.showLoader();
    if(param == "save"){//save ?
      if(window.innerWidth <= 767 || window.innerHeight <= 580 || this.mainService.iframeResizeValue === undefined){//mobile mode ? stretch iframeResizeValue
        this.mainService.isMobileMode = true;
        if(this.layout == 1 || this.layout == 3){
          this.mainService.iframeResizeValue = this.mainContainerHeight - 10;
        }
        else if(this.layout == 2 || this.layout == 4){
          this.mainService.iframeResizeValue = this.mainContainerWidth - 10;
        } 
      }
      else{
        this.mainService.isMobileMode = false;
      }
      this.mainService.scheduledRunFiddle = true;
      //START save codePositionData objects in MainService
      this.cssPart.canRetrievePositionsAfterLoad = true;
      this.mainService.cssCodePositionData.column = this.cssPart.aceEditor?.getCursorPosition().column;
      this.mainService.cssCodePositionData.row = this.cssPart.aceEditor?.getCursorPosition().row;
      this.mainService.cssCodePositionData.aceRanges = this.cssPart.aceEditor?.getSelection().getAllRanges();

      this.htmlPart.canRetrievePositionsAfterLoad = true;
      this.mainService.htmlCodePositionData.column = this.htmlPart.aceEditor?.getCursorPosition().column;
      this.mainService.htmlCodePositionData.row = this.htmlPart.aceEditor?.getCursorPosition().row; 
      this.mainService.htmlCodePositionData.aceRanges = this.htmlPart.aceEditor?.getSelection().getAllRanges();
      
      console.log("this.mainService.htmlCodePositionData = ", this.mainService.htmlCodePositionData);
      console.log("getAllRanges() = ", this.htmlPart.aceEditor?.getSelection().getAllRanges());
      
      this.jsPart.canRetrievePositionsAfterLoad = true;
      this.mainService.jsCodePositionData.column = this.jsPart.aceEditor?.getCursorPosition().column;
      this.mainService.jsCodePositionData.row = this.jsPart.aceEditor?.getCursorPosition().row;
      this.mainService.jsCodePositionData.aceRanges = this.jsPart.aceEditor?.getSelection().getAllRanges();
      //END save codePositionData objects in MainService

      if(this.appMode == "pastebin"){
        this.changeLayout(1);
      }
      this.iframePart.saveFiddle(this.appMode);
    }
    else{//run
      //console.log("inside mainComponent.runCode()");
      this.iframePart.runFiddle();
    }
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

      case "console":
      this.showConsole = !this.showConsole;
      break;
    }
    this.mainService.showHtml = this.showHtml;
    this.mainService.showCss = this.showCss;
    this.mainService.showJs = this.showJs;
    this.mainService.showResult = this.showResult;

    let self = this;
      //console.log("inside custom interval");
      if (!this.showCss){
        if(this.codePartsArea.nativeElement.querySelector(".code-component-container-css").classList.contains("hide-mobile")){
          //window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          //clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showHtml){
        if(this.codePartsArea.nativeElement.querySelector(".code-component-container-html").classList.contains("hide-mobile")){
          //window.dispatchEvent(new Event("resize", {bubbles: true, cancelable:false }));
          //clearInterval(editorLayoutFixInterval);
        }
      }

      if (!this.showJs){
        if(this.codePartsArea.nativeElement.querySelector(".code-component-container-js").classList.contains("hide-mobile")){
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

  consoleBtnClick(){
    this.isConsoleOn = !this.isConsoleOn;
    this.mainService.isConsoleOn = this.isConsoleOn;
    if(this.isConsoleOn){
      this.iframePart.showConsole();
    }
    else{
      this.iframePart.hideConsole();
    }
    this.calculateIframeSize();
  }

  getEmptyAreaSize(areaNum:number){
    if(areaNum == 1){
      return this.emptyArea_1_Size + "px";
    }
    else if(areaNum == 2){
      return this.emptyArea_2_Size + "px"
    }
  }

  getIframeAreaSize(): string{
    if(this.IsAfterViewInitReached){
      let size = 0;
      let mainContainer = this.mainContainer.nativeElement;
      if(this.layout == 1 || this.layout == 3){
        size = this.mainContainerHeight;
      }
      else if(this.layout == 2 || this.layout == 4){
        size = this.mainContainerWidth;
      }
      return size - this.emptyArea_2_Size * 2 - 10 + 'px';
        
    }
    else return "0px";
  }

  /**
   * 
   * @param event MouseEvent (mousedown) or TouchEvent (touchstart)
   * @param customGutterNum gutter mumber: 1 || 2 || 3 || 4 || 5
   */
  onGutterCustomMousedown(event: any, customGutterNum){
    console.log('onGutterCustomMousedown ev = ', event);
    event.preventDefault();
    if(customGutterNum == 3){//Main container gutter ?
      this.isMainContainerGutter_dragging = true;

      //console.log("mousedown customGutterNum = " + customGutterNum);
      //console.log("--------------------------");
    }
    else if(customGutterNum == 4){//iframe first gutter
      this.isCustomGutter1_dragging = true;
      this.isCustomGutter2_dragging = false;

      //console.log("mousedown event.type = " + event.type);
      //console.log("--------------------------");
    }
    else if(customGutterNum == 5){//iframe second gutter
      this.isCustomGutter2_dragging = true;
      this.isCustomGutter1_dragging = false;

      //console.log("mousedown event.type = " + event.type);
      //console.log("--------------------------");
    }
    else if(customGutterNum == 1){
      this.isGutter1_dragging = true;

    }

    else if(customGutterNum == 2){
      this.isGutter2_dragging = true;

    }

    this.isFiddleHeightInputDisabled = true;
    this.isFiddleWidthInputDisabled = true;
  }

  onAsSplitAreaIframeMousemove(event: any ){
    let generateCoordinate = (gutterNumber: number)=>{
      let eventClientXOrY;
      let htmlCssGutter = 1;
      let cssJsGutter = 2;
      let codePartsGutter = 3;
      let customGutter1 = 4;
      let customGutter2 = 5;
      console.log("move event.type = ", event.type);
      if(event.type == "touchmove"){
        if(this.layout == 1 || this.layout == 3){
          eventClientXOrY = [htmlCssGutter, cssJsGutter, customGutter1, customGutter2].includes(gutterNumber) ? event.touches[0].clientY : event.touches[0].clientX;
        }
        else if(this.layout == 2 || this.layout == 4){
          eventClientXOrY = [htmlCssGutter, cssJsGutter, customGutter1, customGutter2].includes(gutterNumber) ? event.touches[0].clientX : event.touches[0].clientY;
        }
      }
      else{
        if(this.layout == 1 || this.layout == 3){
          eventClientXOrY = [htmlCssGutter, cssJsGutter, customGutter1, customGutter2].includes(gutterNumber) ? event.clientY : event.clientX;
        }
        else if(this.layout == 2 || this.layout == 4){
          eventClientXOrY = [htmlCssGutter, cssJsGutter, customGutter1, customGutter2].includes(gutterNumber) ? event.clientX : event.clientY;
        }
      }
      return eventClientXOrY;
    }

    let evTarget = event.target as HTMLElement;

      if(this.IsAfterViewInitReached){
        
        let emptyArea1 = this.emptyArea1.nativeElement as HTMLElement;
        let emptyArea2 = this.emptyArea2.nativeElement as HTMLElement;

        let mainContainer = this.mainContainer.nativeElement as HTMLElement;
        let codePartsArea = this.codePartsArea.nativeElement as HTMLElement;
        if(this.isCustomGutter1_dragging){
          let eventClientXOrY = generateCoordinate(4);
          if(!this.showIframeOverlay){
            this.showIframeOverlay = true; 
          }
          event.preventDefault();
          //console.log("mousemove evTarget = ", evTarget);
          //console.log("isCustomGutter1_dragging is true");
          if(this.layout == 1 || this.layout == 3){//layout 1 or 3 ?
            let emptyArea1_height = emptyArea1.offsetHeight;
            emptyArea1_height = eventClientXOrY - mainContainer.getBoundingClientRect().top; //calculate new emptyArea1_height value
            //make sure emptyArea1_height is between 0 and mainContainer.offsetHeight / 2 - 5
            if(emptyArea1_height < 0){
              emptyArea1_height = 0;
            }
            else if(emptyArea1_height > mainContainer.offsetHeight / 2 - 5){
              emptyArea1_height = mainContainer.offsetHeight / 2 - 5;
            }
            this.emptyArea_1_Size = emptyArea1_height;
            this.emptyArea_2_Size = emptyArea1_height;
          }
          else if(this.layout == 2 || this.layout == 4){//layout 2 or 4
            let emptyArea1_width = emptyArea1.offsetWidth;
            emptyArea1_width = eventClientXOrY - mainContainer.getBoundingClientRect().left; //calculate new emptyArea1_width value
            //make sure emptyArea1_width is between 0 and mainContainer.offsetWidth / 2 - 5
            if(emptyArea1_width < 0){
              emptyArea1_width = 0;
            }
            else if(emptyArea1_width > mainContainer.offsetWidth / 2 - 5){
              emptyArea1_width = mainContainer.offsetWidth / 2 - 5;
            }
            this.emptyArea_1_Size = emptyArea1_width;
            this.emptyArea_2_Size = emptyArea1_width;
          }
          this.calculateIframeSize(mainContainer);
          this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
        }
        else if(this.isCustomGutter2_dragging){
          let eventClientXOrY = generateCoordinate(5);
          if(!this.showIframeOverlay){
            this.showIframeOverlay = true; 
          }
          event.preventDefault();
          //console.log("mousemove evTarget = ", evTarget);
          //console.log("isCustomGutter2_dragging is true");

            if(this.layout == 1 || this.layout == 3){
              let emptyArea2_height = emptyArea2.offsetHeight;
              
              emptyArea2_height = mainContainer.getBoundingClientRect().bottom - eventClientXOrY ;
  
              if(emptyArea2_height < 0){
                emptyArea2_height = 0;
              }
              else if(emptyArea2_height > mainContainer.offsetHeight / 2 - 5){
                emptyArea2_height = mainContainer.offsetHeight / 2 - 5;
              }
              this.emptyArea_2_Size = emptyArea2_height;
              this.emptyArea_1_Size = emptyArea2_height;
              //console.log("emptyArea2_height = ", emptyArea2_height);
            }
            else if(this.layout == 2 || this.layout == 4){
              let emptyArea2_width = emptyArea2.offsetWidth;
  
              emptyArea2_width = mainContainer.getBoundingClientRect().right - eventClientXOrY ;
  
              if(emptyArea2_width < 0){
                emptyArea2_width = 0;
              }
              else if(emptyArea2_width > mainContainer.offsetWidth / 2 - 5){
                emptyArea2_width = mainContainer.offsetWidth / 2 - 5;
              }
              this.emptyArea_2_Size = emptyArea2_width;
              this.emptyArea_1_Size = emptyArea2_width;
            }
          
          this.calculateIframeSize(mainContainer);
          this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
        }
        else if(this.isMainContainerGutter_dragging){
          let eventClientXOrY = generateCoordinate(3);
          if(!this.showIframeOverlay){
            this.showIframeOverlay = true; 
          }
          event.preventDefault();
          //console.log("mousemove evTarget = ", evTarget);
          console.log("eventClientXOrY = ", eventClientXOrY);

            if(this.layout == 1 || this.layout == 3){              
              let codePartsWidth = (this.layout == 1) ? (eventClientXOrY - mainContainer.getBoundingClientRect().left) : Math.abs(eventClientXOrY - mainContainer.getBoundingClientRect().right);
  
              if(codePartsWidth < 300){
                codePartsWidth = 300;
              }
              else if(codePartsWidth > mainContainer.offsetWidth - 5){
                codePartsWidth = mainContainer.offsetWidth - 5;
              }
              this.finalCodePartSize = codePartsWidth;
              console.log("codePartsWidth = ", codePartsWidth);
            }
            else if(this.layout == 2 || this.layout == 4){
              let codePartsHeight = this.layout == 2 ? eventClientXOrY - mainContainer.getBoundingClientRect().top : Math.abs(eventClientXOrY - mainContainer.getBoundingClientRect().bottom );
  
              if(codePartsHeight < 300){
                codePartsHeight = 300;
              }
              else if(codePartsHeight > mainContainer.getBoundingClientRect().height - 5){
                codePartsHeight = mainContainer.getBoundingClientRect().height - 5;
              }
              this.finalCodePartSize = codePartsHeight;
              console.log("codePartsHeight = ", codePartsHeight);
            }
          
          this.calculateIframeSize(mainContainer);
          this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
        }
        else if(this.isGutter1_dragging){
          let eventClientXOrY = generateCoordinate(1);
          if(!this.showIframeOverlay){
            this.showIframeOverlay = true; 
          }
          event.preventDefault();
          //console.log("mousemove evTarget = ", evTarget);
          console.log("eventClientXOrY = ", eventClientXOrY);

            if(this.layout == 1 || this.layout == 3){      
              //let htmlPartSize = this.finalHtmlCodePartSize;
              let cssPartSize = this.finalCssCodePartSize;
              let jsPartSize = this.finalJsCodePartSize;        

              let htmlPartSize = eventClientXOrY - codePartsArea.getBoundingClientRect().top;
              console.log("htmlPartSize = ", htmlPartSize);


              let newHtmlSize = htmlPartSize;
              if(newHtmlSize < 24){
                newHtmlSize = 24
              }
              let diff = newHtmlSize - this.finalHtmlCodePartSize;

              this.finalHtmlCodePartSize = newHtmlSize;


              let newCssSize = this.finalCssCodePartSize - diff;

              if(newCssSize < 24){
                newCssSize = 24;

                ///
                let newJsSize = this.finalJsCodePartSize - diff;
                if(newJsSize < 24){
                  newJsSize = 24;
                }
                this.finalJsCodePartSize = newJsSize;
              }
              this.finalCssCodePartSize = newCssSize;

            }
            else if(this.layout == 2 || this.layout == 4){
              let htmlPartSize = eventClientXOrY - codePartsArea.getBoundingClientRect().left;
              console.log("htmlPartSize = ", htmlPartSize);
              this.finalHtmlCodePartSize = htmlPartSize;
            }
          
          this.calculateIframeSize(mainContainer);
          this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());

        }
        else if(this.isGutter2_dragging){

        }
      } 
  }

  onFiddleWidthChange(data){
    let newFiddleWidth = parseInt(data);

    switch(this.layout){
      case 1:
      
      if(newFiddleWidth <= (this.mainContainerWidth - 350 - 5)){
        this.finalCodePartSize = this.mainContainerWidth - newFiddleWidth - 5;
        this.mainService.codePartsSize = this.finalCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;

      case 2:

        if(newFiddleWidth > (this.mainContainerWidth - 5)){
          this.calculateIframeSize();
        }
        else if(newFiddleWidth < 0){
          this.calculateIframeSize();
        }

        if(newFiddleWidth > (this.mainContainerWidth - 10)){
          this.calculateIframeSize();
        }
        else if(newFiddleWidth < 0){
          this.calculateIframeSize();
        }
        else{
          this.emptyArea_1_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 5;
          this.emptyArea_2_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 5;
        }

      break;

      case 3:

      if(newFiddleWidth <= (this.mainContainerWidth - 350 - 5)){
        this.finalCodePartSize = this.mainContainerWidth - newFiddleWidth - 5;
        this.mainService.codePartsSize = this.finalCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;

      case 4:

      if(newFiddleWidth > (this.mainContainerWidth - 10)){
        this.calculateIframeSize();
      }
      else if(newFiddleWidth < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 5;
        this.emptyArea_2_Size = (this.mainContainerWidth - newFiddleWidth) / 2 - 5;
      }

      break;
    }

    this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
  }

  onFiddeHeightChange(data){
    let newFiddleHeight = parseInt(data);

    switch(this.layout){
      case 1:
      
      if(newFiddleHeight > (this.mainContainerHeight - 10)){
        this.calculateIframeSize();
      }
      else if(newFiddleHeight < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 5;
        this.emptyArea_2_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 5;
      }

      break;

      case 2:

      if(newFiddleHeight <= (this.mainContainerHeight - 300 - 5)){
        this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter,  [this.mainContainerHeight - newFiddleHeight - 5, "*"]);
        this.finalCodePartSize = this.mainContainerHeight - newFiddleHeight - 5;
        this.mainService.codePartsSize = this.finalCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;

      case 3:

      if(newFiddleHeight > (this.mainContainerHeight - 10)){
        this.calculateIframeSize();
      }
      else if(newFiddleHeight < 0){
        this.calculateIframeSize();
      }
      else{
        this.emptyArea_1_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 5;
        this.emptyArea_2_Size = (this.mainContainerHeight - newFiddleHeight) / 2 - 5;
      }

      break;

      case 4:

      if(newFiddleHeight <= (this.mainContainerHeight - 300 - 5)){
        this.splitComponentOuter._alignedVisibleAreasSizes.apply(this.splitComponentOuter, ["*", this.mainContainerHeight - newFiddleHeight - 5]  );
        this.finalCodePartSize = this.mainContainerHeight - newFiddleHeight - 5;
        this.mainService.codePartsSize = this.finalCodePartSize;
      }
      else{
        this.calculateIframeSize();
      }

      break;
    }
    this.mainService.iframeResizeValue = parseInt(this.getIframeAreaSize());
  }


  hideModal(){
    this.modal.hide();
  }

  hideHistoryModal(){
    this.modalHistory.hide();
  }

  ressouresBtnClick(){
    this.modal.show();
  }

  showHistoryModal(){
    this.modalHistory.show();
    this.appFiddlesHistory.getFiddlesList();
  }



  getCodePartGutterStyle(type: string){
    let obj: any = {
      "flex-basis": "5px",
    }

    if(this.layout == 1 || this.layout == 3) {
      if(type == "main-container"){
        obj.cursor = "col-resize";
      }
      else if (type == "html-css" || type == "css-js"){
        obj.cursor = "row-resize";
      }
    }
    else{
      if(type == "main-container"){
        obj.cursor = "row-resize";
      }
      else if (type == "html-css" || type == "css-js"){
        obj.cursor = "col-resize";
      }
    }
    
    return obj;
  }

  validateRessources(){
    this.ressourcesComponent.validateRessources();
    this.hideModal();
  }

  onRessourcesValidate(dataEvent: Array<string>){
    this.htmlPart.code = this.mainService.htmlCode;
    dataEvent.forEach((el, index, arr)=>{
      this.htmlPart.code = arr[arr.length - 1 - index] + this.htmlPart.code;
    });
    this.ressourcesComponent.resetCurrentRessourceChoice();
    this.ressourcesComponent.emptySelectedRessourceAssets();
    this.toastrService.success("Ressources prepended to HTML code.");
  }

  getVerticalModeState(codePartType: string){
    if(this.layout == 2 || this.layout == 4){
      switch(codePartType){
        case("html"):
        if(this.finalHtmlCodePartSize < 230){
          return true
        }
        else{
          return false;
        }
  
        case("js"):
        if(this.finalJsCodePartSize < 280){
          return true
        }
        else{
          return false;
        }
  
        case("css"):
        if(this.finalCssCodePartSize < 230){
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

  prettifyMobileCode(){
    if(this.showHtml){
      this.prettifyCode('html');
    }
    else if(this.showCss){
      this.prettifyCode('css');
    }
    else if(this.showJs){
      this.prettifyCode('js');
    }
  }
}