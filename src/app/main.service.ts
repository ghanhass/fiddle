import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { concat, forkJoin, from, merge, Observable, of, Subject, zip } from 'rxjs';
import { environment} from "../environments/environment";
import { FiddleTheme } from './fiddle-theme';
import { FiddleThemeDetails } from './fiddle-theme-details';
import { FiddleData } from './fiddle-data'; 
import { catchError, map, mergeMap, tap, timestamp } from 'rxjs/operators';
import { CodePositionData } from './code-position-data';
import { CssPartComponent } from './css-part/css-part.component';
import { HtmlPartComponent } from './html-part/html-part.component';
import { JsPartComponent } from './js-part/js-part.component';
import { Ace, Range } from 'ace-builds';
import { PastebinComponent } from './pastebin/pastebin.component';
import * as AceAjax from 'brace';



let headers = new HttpHeaders();
headers = headers.set("PRIVATE-TOKEN", window.atob("Z2xwYXQtWXpveENtODZNUXAxT21WM2VHSnBDUkF3ZkVQSEdfMk1rWmZNNldhQUxoQS4xNzF4MDd2aDg="));
headers = headers.set("Content-Type", "application/json");

const gitlabProjectId = "52190204";
const gitlabJsonDbId = "3621546";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  url: string = environment.url;
  jsCode:string;
  cssCode:string;
  htmlCode:string;
  isConsoleOn: boolean;
  pastebinText: string;

  appMode: string = "fiddle";

  isFirstTimeFiddle: boolean = true;

  jsCodeSinceSave:string = "";
  cssCodeSinceSave:string = "";
  htmlCodeSinceSave:string = "";
  pastebinTextSinceSave:string = "";

  layout:number = 1;

  cssCodePartSize:number;
  htmlCodePartSize:number;
  jsCodePartSize:number;
  mainContainerHeight: number;
  mainContainerWidth: number;
  codePartsSize: number;
  iframeResizeValue: number;
  fiddleThemeId: string = '';
  fiddleCreatedAt: number;

  fiddleTitle:string = "";
  redirectAfterSaveMode: boolean = false;

  codeSavingDate: Date =  undefined;

  showHtml: boolean = true;
  showCss: boolean = false;
  showJs: boolean = false;
  showResult: boolean = true;
  isMobileMode: boolean = false;

  scheduledRunFiddle: boolean = false;

  isBeforeUnloadEvHandlerSet: boolean = false;

  htmlCodePositionData: CodePositionData = {
    row:0,
    column: 0,
    focus: false,
    aceRanges: []
  }

  cssCodePositionData: CodePositionData = {
    row:0,
    column: 0,
    focus: false,
    aceRanges: []
  }

  jsCodePositionData: CodePositionData = {
    row:0,
    column: 0,
    focus: false,
    aceRanges: []
  }

  canSaveCodeEditorsPostition: boolean = true;
  canRetrievePositionsAfterLoad: boolean = false;

  selectedTheme: FiddleTheme = {
      name: "VS",
      id: "vs-default",
      data: {
          "base": "vs",
          "inherit": true,
          "rules": [
            {
                "foreground": "333333",
                "background": "ffffff",
                "token": ""
            }
          ],
          "colors": {
              "editor.foreground": "#333333",
              "editor.background": "#FFFFFF",
              "editor.selectionBackground": "#d2d2d2",
              "editor.lineHighlightBackground": "#FFFFFF",
              "editorCursor.foreground": "#333333",
              "editorWhitespace.foreground": "#333333",
              "editor.cursorBlinkShadow": "#000f867a"
          }
      }
  }
  
  themesList : Array<FiddleTheme> = 
    [
      {
          "name": "VS",
          "id": "vs-default",
          "data": {
              "base": "vs",
              "inherit": true,
              "rules": [
                  {
                      "foreground": "333333",
                      "background": "ffffff",
                      "token": ""
                  }
              ],
              "colors": {
                  "editor.foreground": "#333333",
                  "editor.background": "#FFFFFF",
                  "editor.selectionBackground": "#d2d2d2",
                  "editor.lineHighlightBackground": "#FFFFFF",
                  "editorCursor.foreground": "#333333",
                  "editorWhitespace.foreground": "#333333",
                  "editor.cursorBlinkShadow": "#000f867a"
              }
          }
      },
      {
          "name": "VS Dark",
          "id": "vs-default-dark",
          "data": {
              "base": "vs-dark",
              "inherit": true,
              "rules": [],
              "colors": {
                  "editor.foreground": "#d4d4d4",
                  "editor.background": "#1e1e1e",
                  "editor.selectionBackground": "#414141",
                  "editor.lineHighlightBackground": "#1e1e1e",
                  "editorCursor.foreground": "#d4d4d4",
                  "editorWhitespace.foreground": "#d4d4d480",
                  "editor.cursorBlinkShadow": "#ffffff7a"
              }
          }
      }
  ]
  
  private appConfig: any;

  newFiddleIdSubject: Subject<number>

  public beforeUnloadListener: any = (event:BeforeUnloadEvent) => {
    event.preventDefault();
    //console.log("beforeUnload event is set");
    if(this.isCodeChanged()){
      return event.returnValue = "Are you sure you want to exit?";
    }
  };
  
  constructor(private http: HttpClient) { 
    this.jsCode = "";
    this.cssCode = "";
    this.htmlCode = "";

    //console.log("mainService constructor");
  }

  setCheckBeforeUnloadListener(){
    let self = this;
    window.removeEventListener("beforeunload", self.beforeUnloadListener, {capture: true});

    if(this.isCodeChanged()){
      //console.log("isCodeChanged = true");
      window.addEventListener("beforeunload", self.beforeUnloadListener, {capture: true});
    }
    else{
      //console.log("isCodeChanged = false");
      window.removeEventListener("beforeunload", self.beforeUnloadListener, {capture: true}); 
    }
  }

  removeBeforeUnloadListener(){
    let self = this;
    window.removeEventListener("beforeunload", self.beforeUnloadListener, {capture: true});
  }

  initConfig():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.http.get("assets/app-config.json").subscribe(
        (res:any)=>{
          this.appConfig = res;
          //console.log("startup this.appConfig = ", this.appConfig);
          resolve(res);
        },
        (error: any)=>{
          reject(error);
        })
    })
  }

  getConfig(key: string){
    return this.appConfig[key];
  }

  /**
   * 
   * @returns boolean: Returns whether the code is changed or not since last save
   */
  isCodeChanged():boolean{
    return this.jsCode !== this.jsCodeSinceSave || this.cssCode !== this.cssCodeSinceSave || 
    this.htmlCode !== this.htmlCodeSinceSave || this.pastebinText !== this.pastebinTextSinceSave
  }

  /**
   * Reset code marked since last save to the current code
   */
  resetCodeSinceSave(){
    this.jsCodeSinceSave = this.jsCode;
    this.cssCodeSinceSave = this.cssCode;
    this.htmlCodeSinceSave = this.htmlCode;
    this.pastebinTextSinceSave = this.pastebinText;
  }

  resumeFiddleTheme(htmlPartComp?: HtmlPartComponent, cssPartComp?: CssPartComponent, jsPartComp?: JsPartComponent, pastebinPart?: PastebinComponent){
    //console.log("param = ", param);
    //console.log("this.mainService.isFiddleThemeDark = ", this.isFiddleThemeDark);
    let savedThemeId = localStorage.getItem("myfiddle-theme");

    if(savedThemeId){
        this.selectedTheme = this.themesList.find((el)=>{return el.id == savedThemeId});
    }
    //console.log("selectedTheme = ", selectedTheme);

    this.addThemeStylesheet(this.selectedTheme);
    
    if(htmlPartComp){
      htmlPartComp.theme = savedThemeId ? (savedThemeId == "vs-default-dark" ? "cloud9_night" : "cloud9_day" ) : "cloud9_day" 
    }

    if(cssPartComp){
      cssPartComp.theme = savedThemeId ? (savedThemeId == "vs-default-dark" ? "cloud9_night" : "cloud9_day" ) : "cloud9_day" 
    }

    if(jsPartComp){
      jsPartComp.theme = savedThemeId ? (savedThemeId == "vs-default-dark" ? "cloud9_night" : "cloud9_day" ) : "cloud9_day" 
    }

    if(pastebinPart){
      pastebinPart.theme = savedThemeId ? (savedThemeId == "vs-default-dark" ? "cloud9_night" : "cloud9_day" ) : "cloud9_day" 
    }
  }

  prepareThemeStyleSheet(theme: FiddleTheme){
    let str = `.code-part-title {
        background:${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .gutter[class]
    {
        background-color: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .fiddle-size.fiddle-size-hack{
        color: ${theme.data.colors['editor.background']};
        background: ${theme.data.colors['editor.foreground']};
        box-shadow: 0 0 15px 4px ${theme.data.colors['editor.foreground']};
    }
    
    .iframe-overlay {
        background: ${theme.data.colors['editor.background']};
    }
    
    input.form-control.fiddle-input {
        background: ${theme.data.colors['editor.background']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .code-part-title span {
        color: ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout > div:first-child > div {
        outline: 1px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout.active > div:first-child > div {
        outline: 1px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout > div:first-child {
        outline: 2px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout.active > div:first-child {
        outline: 2px solid ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layout {
        background-color: ${theme.data.colors['editor.background']} !important;
        border-color: ${theme.data.colors['editor.foreground']} !important;
        box-shadow: 0 0 0px 1px ${theme.data.colors['editor.background']} !important;
    }
    
    .layout.active {
        background-color: ${theme.data.colors['editor.selectionBackground']} !important;
        border-color: ${theme.data.colors['editor.foreground']} !important;
        box-shadow: 0 0 6px 2px ${theme.data.colors['editor.foreground']} !important;
    }
    
    .layouts-list {
        background-color: ${theme.data.colors['editor.background']} !important;
        box-shadow: 0px 0px 4px 2px ${theme.data.colors['editor.foreground']} !important;
    }
    
    ul.donations-menu.shown,
    .themes-menu.shown{
        box-shadow: 0px 0px 4px 2px ${theme.data.colors['editor.foreground']} !important;
        background-color: ${theme.data.colors['editor.background']} !important;
    }
    
    .paypal-btn-container ul.donations-menu > li,
    .themes-menu.shown > li {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .paypal-btn-container ul.donations-menu > li:hover,
    .themes-menu.shown > li:not(.selected):hover {
        background-color: ${this.enhanceThemesMenuColoration(theme, "background-color")};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choices-container {
        background-color: ${theme.data.colors['editor.background']} !important;
    }
    
    .modal {
        background: ${theme.data.colors['editor.background']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice 
    .ressource-choice-description {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .form-control {
        background: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    button.btn.btn-remove-selected-ressource {
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice .ressource-choice-description[class] {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .paypal-btn-container,
    .themes-btn-container {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    button.btn.paypal-btn {
        color: ${theme.data.colors['editor.foreground']};
        background: ${theme.data.colors['editor.background']};
    }
    
    .header-btns-container .btn:hover,
    .logo-title-container .btn:hover {
        color: ${theme.data.colors['editor.foreground']};
        background: ${theme.data.colors['editor.lineHighlightBackground']};
    }

    .header-btns-container .btn,
    .logo-title-container .btn {
        color: ${theme.data.colors['editor.foreground']};
        background: ${theme.data.colors['editor.background']};
        font-family:Arial, sans-serif;
    }
    
    #code-parts-title-mobile a.active {
        background-color: ${theme.data.colors['editor.selectionBackground']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .paypal-btn-container ul.donations-menu > li:hover {
        background-color: ${theme.data.colors['editor.lineHighlightBackground']};
        font-weight: 600;
    }
    
    .themes-menu.shown > li:not(.selected):hover {
        /*background-color: ${theme.data.colors['editor.lineHighlightBackground']};*/
    }
    
    .themes-menu li.selected {
        font-weight: bold;
        background-color: ${theme.data.colors['editor.selectionBackground']};
        color: ${theme.data.colors['editor.foreground']};
    }

    .ressources-container > hr{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-query-container{
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choices-container{
      background-color: ${theme.data.colors['editor.background']};
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice:first-child ~ .ressources-choice{
      border-top:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice:last-child{
      border-bottom:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice .ressource-choice-description {
      color: ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice:hover {
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }
    
    .ressources-choice.current-choice {
      background-color: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .ressources-choice-files-container{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-selected-files-container{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-files:hover {
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }
    
    .ressources-choice-files.selected {
      background: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .ressources-choice-files:first-child ~ .ressources-choice-files{
      border-top:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-files:last-child {
      border-bottom:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-files-search{
      border-bottom:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-selected-file {
      background-color: ${theme.data.colors['editor.background']};
    }
    
    .ressources-choice-selected-file.placeholder {
      color: ${theme.data.colors['editor.foreground']};
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }
    
    .ressources-choice-selected-file-wrapper.placeholder {
      background-color: ${theme.data.colors['editor.lineHighlightBackground']};
      border: 2px dashed ${theme.data.colors['editor.foreground']};
      border-top: 2px dashed ${theme.data.colors['editor.foreground']};
      border-bottom: 2px dashed ${theme.data.colors['editor.foreground']};
    }
    
    .ressources-choice-selected-file-wrapper {
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .resources-tabs-mobile {
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .resources-tabs-mobile label {
      border:1px solid ${theme.data.colors['editor.foreground']};
    }
    
    .resources-tabs-mobile label.selected{
      background-color:${theme.data.colors['editor.selectionBackground']};
    }
    
    .title{
      border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .modal-close-btn{
        border-color: ${theme.data.colors['editor.foreground']};
        color: ${theme.data.colors['editor.foreground']};
        background-color: ${theme.data.colors['editor.background']};
    }

    .modal-close-btn:active{
        color: ${theme.data.colors['editor.foreground']};
        background-color: ${theme.data.colors['editor.selectionBackground']};
    }

    .modal-close-btn:hover{
        background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }

    app-modal .modal-header .modal-validate-btn{
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
        border-color: ${theme.data.colors['editor.foreground']};
    }

    app-modal .modal-header .modal-validate-btn:hover{
        background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }

    app-modal .modal-header .modal-validate-btn:active{
        background-color: ${theme.data.colors['editor.selectionBackground']};
    }

    .modal{
        background-color: ${theme.data.colors['editor.background']};
        box-shadow: 0 0px 8px 1px ${theme.data.colors['editor.foreground']};
        border: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .modal-container.shown{
        background-color: ${theme.data.colors['editor.background']};
    }

    .layouts-list-container {
        background-color: ${theme.data.colors['editor.background']};
        color:${theme.data.colors['editor.foreground']};
    }
    
    .layouts-list-container:active{
        color: ${theme.data.colors['editor.foreground']};
        background-color: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .layouts-list-container:hover{
        color: ${theme.data.colors['editor.foreground']};
        background-color: ${theme.data.colors['editor.lineHighlightBackground']};
    }
    
    body{
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }

    .code-part-title.half-stretch-mark{
      box-shadow: 0 0 10000px 10000px ${theme.data.colors['editor.selectionBackground']};
      z-index: 1;
      background: ${theme.data.colors['editor.selectionBackground']};
      position: relative;
      opacity:0.5;
    }
    
    .code-part-title.marking-half-stretched-code-part{
        z-index: 1;
        position: relative;
        animation-name: animated-marked-code-part;
        animation-duration:0.5s;
    }

    .code-part-title-btn .fa-arrows-h-vertical > span:first-child {
      width: 100%;
      border-top: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .code-part-title-btn{
      background-color: ${theme.data.colors['editor.background']};
      color: ${theme.data.colors['editor.foreground']};
    }

    .code-part-title-btn.on{
      background-color: ${theme.data.colors['editor.selectionBackground']};
      color: ${theme.data.colors['editor.foreground']};
    }

    .console-btn.console-on,
    .console-btn.console-on:hover
    {
      background-color: ${theme.data.colors['editor.selectionBackground']};
      color: ${theme.data.colors['editor.foreground']};
    }

    button.tools-btn.btn span {
      border: 2px solid ${theme.data.colors['editor.foreground']};
    }

    .fiddle-link {
      border: 1px solid ${theme.data.colors['editor.foreground']};
      color:  ${theme.data.colors['editor.foreground']};
    }

    .history-container table thead{
      box-shadow: 0px 0px 3px 1px ${theme.data.colors['editor.cursorBlinkShadow']};
      background-color: ${theme.data.colors['editor.background']};
    }

    .history-container .pagination a{
      border: 1px solid ${theme.data.colors['editor.cursorBlinkShadow']};
    }

    .history-container .table-container{
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .history-container table td, .history-container table th {
      border: 1px solid ${theme.data.colors['editor.foreground']};
    }

    .history-container .search-table input {
      color: ${theme.data.colors['editor.foreground']};
      background-color: ${theme.data.colors['editor.background']};
      border-color: ${theme.data.colors['editor.cursorBlinkShadow']};
    }

    .history-container .search-table input:focus-visible {
      box-shadow: 0px 0px 3px 1px ${theme.data.colors['editor.foreground']};
    }

    .loader-wrapper{
      background-color: ${theme.data.colors['editor.background']}
    }

    @keyframes blink{
      0%{
        box-shadow: none;
      }
  
      50%{
        box-shadow: inset 0px 0px 6px 3px ${theme.data.colors['editor.cursorBlinkShadow']};
      }
  
      100%{
        box-shadow: none;
      }
    }

    @media (max-width:818px), (max-height:580px) {
      as-split-area.codeparts-container{
        border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
      }

      as-split-area.as-split-area-console{
        border-top: 1px solid ${theme.data.colors['editor.foreground']};
      }
    }
    
    @keyframes animated-marked-code-part{
        
        0%{
            background:${theme.data.colors['editor.selectionBackground']};
            box-shadow: 0 0 10000px 10000px ${theme.data.colors['editor.selectionBackground']};
            opacity:0.5;
        }
      
        100%{
            background:${theme.data.colors['editor.background']};
            box-shadow:none;
            opacity:1;
        }
      
    }

    @keyframes cling{
      0%{
          box-shadow: 0 0 0px 0px ${theme.data.colors['editor.foreground']};
      }
  
      50%{
          box-shadow: 0 0 4px 4px ${theme.data.colors['editor.foreground']};
      }
  
      100%{
          box-shadow: 0 0 0px 0px ${theme.data.colors['editor.foreground']};
      }
  }
    `;

    return str;
  }

  addThemeStylesheet(theme: FiddleTheme){    
      let themeStylesheet = document.querySelector("style#theme-stylesheet") as HTMLStyleElement;
      if(themeStylesheet){
        themeStylesheet.remove();
      }

      themeStylesheet = document.createElement("style");
      themeStylesheet.id = "theme-stylesheet";
      document.head.appendChild(themeStylesheet);
      themeStylesheet.textContent = this.prepareThemeStyleSheet(theme);
    
  }

  enhanceThemesMenuColoration(theme: FiddleTheme, cssProperty: string){
    if(theme.id == "vs-default"){
      switch(cssProperty){
        case "background-color":
        return "rgba(128, 128, 128, 0.11)";
      }
    }
    else if(theme.id == "vs-default-dark"){
      switch(cssProperty){
        case "background-color":
        return "#333333";
      }
    }
    else{
      return theme.data.colors['editor.lineHighlightBackground'];
    }
  }

  generateFiddleCode(data: any): string{
    //console.log("generateFiddleCode data.isConsoleOn: ", this.isConsoleOn);
    let htmlCode = data.html ? data.html : "";
    let cssCode = data.css ? data.css : "";
    let jsCode = `
      <script id="fiddle-security">
      if(window.self === window.top){
        document.head.innerHTML = "<meta charset='utf-8'>";
        document.body.innerHTML = "<h1>Running this web page directly is forbidden, good day.</h1>";
      }
      document.querySelector("script#fiddle-security").remove();
      </script>

      <script>
      window.isConsoleOn = ${this.isConsoleOn};
      window.currentTheme = ${JSON.stringify(this.selectedTheme.data)};
      </script>

      <script>
        \n\n ${data.js}\n\n  

      </script>
      `;

    let html = `
    <!DOCTYPE html>
    <html>
        <head>
        </head>
        <body> 
            ${htmlCode}

            <script>
		  	    window.onerror = function(e) {
		  	    	window.detectedError = e;
		  	    };
		        </script>

            ${jsCode}

            <style>
            ${cssCode}
            </style>
        </body>
    </html>`;
    return html;
  }

  retrieveCodePartsCursors(cssPart?: CssPartComponent, htmlPart?: HtmlPartComponent, jsPart?: JsPartComponent, blink?: boolean){
    if(cssPart){
      //retrieve css code part focus and cursor position
      console.log("called //cssPart.aceEditor.focus()");

      let noSelection: boolean = this.cssCodePositionData.aceRanges.length == this.cssCodePositionData.aceRanges.filter((el:AceAjax.Range)=>{
        return el.start.column == el.end.column && el.start.row == el.start.row
      }).length
        ////cssPart.aceEditor.selection.setRange(this.cssCodePositionData.aceRanges[0]);
        let upMostSelection = this.cssCodePositionData.aceRanges.sort((el1, el2)=>{return el1.start.row - el2.start.row})[0];
        let upMostRow = upMostSelection.start.row;
        this.cssCodePositionData.aceRanges.forEach((el)=>{
          //cssPart.aceEditor.selection.addRange(new AceAjax.Range(el.start.row, el.start.column, el.end.row, el.end.column));
        })
        ////cssPart.aceEditor.moveCursorTo(upMostSelection.start.row, upMostSelection.start.column);
      
        if(noSelection){
          if(this.cssCodePositionData.focus){
            //cssPart.aceEditor.focus();
          }
          //cssPart.aceEditor.moveCursorTo(this.cssCodePositionData.row, this.cssCodePositionData.column);
        }
        else if(blink){
          document.querySelector("app-css-part .custom-layer-marker").classList.add("show");
          setTimeout(()=>{
            document.querySelector("app-css-part .custom-layer-marker").classList.remove("show");
          }, 1500)
        }
        //cssPart.aceEditor.scrollToRow();

    }
    if(jsPart){
      //retrieve js code part focus and cursor position
      console.log("called //jsPart.aceEditor.focus()");

      let noSelection: boolean = this.jsCodePositionData.aceRanges.length == this.jsCodePositionData.aceRanges.filter((el:AceAjax.Range)=>{
        return el.start.column == el.end.column && el.start.row == el.start.row
      }).length
        ////jsPart.aceEditor.selection.setRange(this.jsCodePositionData.aceRanges[0]);
        let upMostSelection = this.jsCodePositionData.aceRanges.sort((el1, el2)=>{return el1.start.row - el2.start.row})[0];
        let upMostRow = upMostSelection.start.row;
        this.jsCodePositionData.aceRanges.forEach((el)=>{
          //jsPart.aceEditor.selection.addRange(new AceAjax.Range(el.start.row, el.start.column, el.end.row, el.end.column));
        })
        ////jsPart.aceEditor.moveCursorTo(upMostSelection.start.row, upMostSelection.start.column);
      
        if(noSelection){
          if(this.jsCodePositionData.focus){
            //jsPart.aceEditor.focus();
          }
          //jsPart.aceEditor.moveCursorTo(this.jsCodePositionData.row, this.jsCodePositionData.column);
        }
        else if(blink){
          document.querySelector("app-js-part .custom-layer-marker").classList.add("show");
          setTimeout(()=>{
            document.querySelector("app-js-part .custom-layer-marker").classList.remove("show");
          }, 1500)
        }
        //jsPart.aceEditor.scrollToRow();

    }
     if(htmlPart){
      //retrieve html code part focus and cursor position
      console.log("called htmlPart.aceEditor.focus()");

      let noSelection: boolean = this.htmlCodePositionData.aceRanges.length == this.htmlCodePositionData.aceRanges.filter((el:AceAjax.Range)=>{
        return el.start.column == el.end.column && el.start.row == el.start.row
      }).length
        //htmlPart.aceEditor.selection.setRange(this.htmlCodePositionData.aceRanges[0]);
        let upMostSelection = this.htmlCodePositionData.aceRanges.sort((el1, el2)=>{return el1.start.row - el2.start.row})[0];
        let upMostRow = upMostSelection.start.row;
        this.htmlCodePositionData.aceRanges.forEach((el)=>{
          //htmlPart.aceEditor.selection.addRange(new AceAjax.Range(el.start.row, el.start.column, el.end.row, el.end.column));
        })
        //htmlPart.aceEditor.moveCursorTo(upMostSelection.start.row, upMostSelection.start.column);
      
        if(noSelection){
          console.log("NO SELECTION !");
          if(this.htmlCodePositionData.focus){
            //htmlPart.aceEditor.focus();
          }
          //htmlPart.aceEditor.moveCursorTo(this.htmlCodePositionData.row, this.htmlCodePositionData.column);
        }
        else if(blink){
          document.querySelector("app-html-part .custom-layer-marker").classList.add("show");
          setTimeout(()=>{
            document.querySelector("app-html-part .custom-layer-marker").classList.remove("show");
          }, 1500)
        }
        //htmlPart.aceEditor.scrollToRow();

      console.log("htmlCodePositionData = ", this.htmlCodePositionData);
    }
  }

  getFiddlesList(page?: number): Observable<any>{
    //console.log("getFiddle fiddleId = ",fiddleId);
    let self = this;
    let str;
    if(environment.production){
      str = page ? ("&page="+page) : "";
      let promise = new Promise((resolve, reject)=>{

        let gitlabRawSnippetUrl = `https://gitlab.com/api/v4/projects/${gitlabProjectId}/snippets?per_page=30`+str;
            this.http.get<any>(gitlabRawSnippetUrl, {headers: headers}).subscribe({//get seeked fiddle content from gitlab
              next: (res2: FiddleData)=>{
                let result = res2;
                resolve(result);
              },
              error: (error2)=>{
                resolve({
                  status:"not found"
                })
              }
            });
      });
      return from(promise);
    }
    else{
      str = page ? ("&_page="+page) : "";
      return this.http.get<Array<FiddleData>>("http://localhost:3000/gists?per_page=30"+str);
    }
  }


  getFiddle(fiddleId): Observable<any>{
    //console.log("getFiddle fiddleId = ",fiddleId);
    let self = this;
          
    if(environment.production){
      let promise = new Promise((resolve, reject)=>{

        let gitlabRawSnippetUrl = `https://gitlab.com/api/v4/projects/${gitlabProjectId}/snippets/${fiddleId}/raw`;
            this.http.get<any>(gitlabRawSnippetUrl, {headers: headers}).subscribe({//get seeked fiddle content from gitlab
              next: (res2: FiddleData)=>{
                let result ;
                if(res2.hasOwnProperty("css") && res2.hasOwnProperty("js") && res2.hasOwnProperty("html")){
                  result = {
                    status: "ok",
                    fiddleData: res2
                  }
                }
                else{
                  result = {
                    status:"not found"
                  }
                }
                resolve(result);
              },
              error: (error2)=>{
                resolve({
                  status:"not found"
                })
              }
            });
      });
      return from(promise);
    }
    else{
      return this.http.get<Array<FiddleData>>("http://localhost:3000/gists?id="+fiddleId).pipe(
        map((value:Array<FiddleData>)=>{
          if(value.length){
            return{
              status:"ok",
              fiddleData: value[0]
            }
          }
          else{
            return {
              status:"not found"
            }
          }
        })); 
    }
  }

  saveFiddle(fiddleData: FiddleData): Observable<any>{
    //let html = this.generateFiddleCode(fiddleData);
    let self = this;
    if(environment.production){
      let timeStamp = (new Date()).getTime();
      let body = {
        file_name: fiddleData.appmode+"_"+timeStamp,
        title: fiddleData.title ? fiddleData.title : "Noname",
        visibility: "public",
        "content": JSON.stringify(fiddleData),
        "file_path": timeStamp,
      }
      let newSnippetRawUrl;
      let newFiddleId;

      let promise = new Promise((resolve, reject)=>{
        this.http.post<any>("https://gitlab.com/api/v4/projects/52190204/snippets", body, {headers: headers}).subscribe(
        {
          next: (res1)=>{
            //console.log("res1 = ", res1);
            newSnippetRawUrl = `https://gitlab.com/api/v4/projects/${gitlabProjectId}/snippets/${res1.id}/raw`;
            newFiddleId = res1.id;
            resolve(newFiddleId);
          },
          error: (err1)=>{
            reject(err1)
          }
        }
      );
      });
      return from(promise);
    }

    else{
      return from( new Promise((resolve,reject)=>{
        this.http.get<Array<FiddleData>>("http://localhost:3000/gists?_sort=id&_order=desc&_limit=1").subscribe((res)=>{
          let newId;
          if(res.length){
            let lastId = res[0].id;
            newId = lastId+1;
          }
          else{
            newId = 1;
          }
          fiddleData.id = newId;
          this.http.post("http://localhost:3000/gists", fiddleData).subscribe((res2)=>{
            resolve(newId);
          })
        },
        (error)=>{
          reject(-1);
        })
      }) )
    }
    
  }
  /*deleteAllGists(){
    octokit.request('GET /gists?_='+(new Date).getTime(),{
      public:false,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then((res)=>{
      //console.log("get all gists res = ", res);
      res.data.forEach((oneGist)=>{
        if(oneGist.files["myfiddle_db.json"] === undefined){
          octokit.request('DELETE /gists/'+oneGist.id,{
            gist_id:oneGist.id,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          }).then((res)=>{
            //console.log("deleted gist with id = ", oneGist.id);
          });
        }
        else{
          octokit.request('PATCH /gists/'+oneGist.id,{ //insert new fiddleGistData in myfiddle_db.json gists array and return the final promise
            gist_id:oneGist.id,
            files:{ "myfiddle_db.json": { content: "{}" } },
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });
        }
      });
    })
  }*/
}