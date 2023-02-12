import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { from, Observable } from 'rxjs';
import { environment} from "../environments/environment";
import { FiddleTheme } from './fiddle-theme';
import { FiddleThemeDetails } from './fiddle-theme-details';
import { Octokit } from '@octokit/core';
import { GistData } from './gist-data';
import { FiddleData } from './fiddle-data';
import { GistFiddle } from './gist-fiddle';
import { map } from 'rxjs/operators';


const octokit = new Octokit({auth: window.atob('Z2hwX0tvQjlMWXlNY3Zpb3VDRDc1Q1doek5YR3dBSWpoMTJTYVNrZw==')});

@Injectable({
  providedIn: 'root'
})
export class MainService {
  httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"}),
    responseType: 'text' as 'text'
  }
  url: string = environment.url;
  jsCode:string;
  cssCode:string;
  htmlCode:string;
  isConsoleOn: boolean;

  jsCodeSinceSave:string = "";
  cssCodeSinceSave:string = "";
  htmlCodeSinceSave:string = "";

  layout:number = 1;

  cssCodePartSize:number;
  htmlCodePartSize:number;
  jsCodePartSize:number;
  mainContainerHeight: number;
  mainContainerWidth: number;
  codePartsSize: number;
  iframeResizeValue: number;
  fiddleThemeId: string = '';

  fiddleTitle:string = "";
  redirectAfterSaveMode: boolean = false;

  isCtrlKeyOn: boolean = false;
  isAltKeyOn: boolean = false;
  canEmitCodeMsg: boolean = true;
  codeExecutionDate: Date =  undefined;

  showHtml: boolean = true;
  showCss: boolean = false;
  showJs: boolean = false;
  showResult: boolean = true;

  scheduledRunFiddle: boolean = false;
  scheduledFiddleSaving: boolean = false;

  isBeforeUnloadEvHandlerSet: boolean = false;

  selectedTheme: FiddleTheme = {
      name: "VS",
      id: "vs-default",
      data: {
          "base": "vs",
          "inherit": true,
          "rules": [
            {
                "foreground": "202020",
                "background": "ffffff",
                "token": ""
            }
          ],
          "colors": {
              "editor.foreground": "#202020",
              "editor.background": "#FFFFFF",
              "editor.selectionBackground": "#d2d2d2",
              "editor.lineHighlightBackground": "#FFFFFF",
              "editorCursor.foreground": "#202020",
              "editorWhitespace.foreground": "#202020"
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
                      "foreground": "202020",
                      "background": "ffffff",
                      "token": ""
                  }
              ],
              "colors": {
                  "editor.foreground": "#202020",
                  "editor.background": "#FFFFFF",
                  "editor.selectionBackground": "#d2d2d2",
                  "editor.lineHighlightBackground": "#FFFFFF",
                  "editorCursor.foreground": "#202020",
                  "editorWhitespace.foreground": "#202020"
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
                  "editorWhitespace.foreground": "#d4d4d480"
              }
          }
      }
  ]
  
  private appConfig: any;

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

    console.log("mainService constructor");
  }

  setCheckBeforeUnloadListener(){
    let self = this;
    window.removeEventListener("beforeunload", self.beforeUnloadListener, {capture: true});

    if(this.isCodeChanged()){
      console.log("isCodeChanged = true");
      window.addEventListener("beforeunload", self.beforeUnloadListener, {capture: true});
    }
    else{
      console.log("isCodeChanged = false");
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

  registerMonacoCustomTheme(fiddleTheme: FiddleTheme) {
    let self = this;
    ////console.log("A!");
    setTimeout(()=>{
      if(window['monaco']){
        ////console.log("fiddleTheme = ", fiddleTheme);
        window['monaco'].editor.defineTheme('myCustomTheme', fiddleTheme.data as any);
        window['monaco'].editor.setTheme("myCustomTheme");
      }
    },1);
  }

  /**
   * 
   * @returns boolean: Returns whether the code is changed or not since last save
   */
  isCodeChanged():boolean{
    return this.jsCode !== this.jsCodeSinceSave || this.cssCode !== this.cssCodeSinceSave || this.htmlCode !== this.htmlCodeSinceSave
  }

  /**
   * Reset code marked since last save to the current code
   */
  resetCodeSinceSave(){
    this.jsCodeSinceSave = this.jsCode;
    this.cssCodeSinceSave = this.cssCode;
    this.htmlCodeSinceSave = this.htmlCode;
  }

  resumeFiddleTheme(){
    ////console.log("param = ", param);
    ////console.log("this.mainService.isFiddleThemeDark = ", this.isFiddleThemeDark);
    let savedThemeId = localStorage.getItem("myfiddle-theme");

    if(savedThemeId){
        this.selectedTheme = this.themesList.find((el)=>{return el.id == savedThemeId});
    }
    ////console.log("selectedTheme = ", selectedTheme);

    this.addThemeStylesheet(this.selectedTheme);
    this.registerMonacoCustomTheme(this.selectedTheme);
    
  }

  prepareThemeStyleSheet(theme: FiddleTheme){
    let str = `.code-part-title {
        background:${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .as-split-outer[class] > .as-split-gutter[class],
    .as-split-gutter-custom,
    #code-parts[id] .as-split-gutter[class]
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
    
    .ressources-container > hr {
        border: 2px solid ${theme.data.colors['editor.foreground']} !important;
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

    @media (max-width:818px), (max-height:580px) {
      as-split-area.as-split-area-code-parts{
        border-bottom: 1px solid ${theme.data.colors['editor.foreground']};
      }

      as-split-area.as-split-area-iframe{
        border-top: 1px solid ${theme.data.colors['editor.foreground']};
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
            background:${theme.data.colors['editor.background']};;
            box-shadow:none;
            opacity:1;
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
    console.log("generateFiddleCode data.isConsoleOn: ", this.isConsoleOn);
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
            <style>
            ${cssCode}
            </style>
        </head>
        <body> 
        <script>
		  	window.onerror = function(e) {
		  		window.detectedError = e;
		  	};
		    </script>
            ${htmlCode}

            ${jsCode}
        </body>
    </html>`;
    return html;
  }

  getFiddle(fiddleId): Observable<any>{
    console.log("getFiddle fiddleId = ",fiddleId);
    let self = this;
 
    if(environment.production){
      return from( octokit.request('GET /gists/1563db4e57ed1ad28627a5df6fb5037a?_='+(new Date).getTime(),{//get last fiddle_id myfiddle_db.json 
        gist_id:"1563db4e57ed1ad28627a5df6fb5037a"
      }).then((res)=>{
        let str = res.data.files["myfiddle_db.json"].content;
        let gistData: GistData;
        if(str){
          gistData = JSON.parse(str);
        }
        else{
          gistData = {gists: []};
        }
  
        if(gistData.gists == undefined){
          gistData.gists = [];
        }
  
        let seekedFiddle: GistFiddle = gistData.gists.find((fiddle)=>{
          return fiddle.fiddle_id == fiddleId;
        });
  
        if(seekedFiddle){
          let gistId = seekedFiddle.gist_id;
          return octokit.request('GET /gists/'+gistId+'?_='+(new Date).getTime(),{//get last fiddle_id myfiddle_db.json 
            gist_id:gistId
          }).then((res2)=>{
            if(res2.status == 200){
              let content: string = (Object.values(res2.data.files)[0] as any).content;
              let fiddleData: FiddleData = JSON.parse(content);
              return new Promise((resolve)=>{
                resolve({
                  status:"ok",
                  fiddleData: fiddleData
                });
              });
            }
            else{
              return new Promise((resolve)=>{
                resolve({
                  status:"not found"
                }
                );
              });
            }
          })
        }
        else{
          return new Promise((resolve)=>{
            resolve({
              status:"not found"
            })
          });
        }
      })
      );
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
      return from (octokit.request('POST /gists?_='+(new Date).getTime(),{//create new gist
        files:{ [""]: { content: JSON.stringify(fiddleData) } },
        public:false
      }).then((res)=>{
        //console.log("new gist res = ", res);
        let newGistId = res.data.id;
        return octokit.request('GET /gists/1563db4e57ed1ad28627a5df6fb5037a?_='+(new Date).getTime(),{//get last fiddle_id myfiddle_db.json 
          gist_id:"1563db4e57ed1ad28627a5df6fb5037a"
        }).then((res2)=>{
          let str = res2.data.files["myfiddle_db.json"].content;
          let gistData: GistData;
          if(str){
            gistData = JSON.parse(str);
          }
          else{
            gistData = {gists: []};
          }
          if(gistData.gists == undefined){
            gistData.gists = [];
          }
  
          //console.log("gistData = ", gistData);
  
          let newFiddleId = gistData.gists.length + 1;
  
          let fiddleGistData : GistFiddle = {
            fiddle_id: newFiddleId,
            gist_id: newGistId
          }
  
          gistData.gists.push(fiddleGistData);
  
            
          return octokit.request('PATCH /gists/1563db4e57ed1ad28627a5df6fb5037a?_='+(new Date).getTime(),{ //insert new fiddleGistData in myfiddle_db.json gists array and return the final promise
            gist_id:"1563db4e57ed1ad28627a5df6fb5037a",
            files:{ "myfiddle_db.json": { content: JSON.stringify(gistData) } },
          }).then((res)=>{
            return new Promise((yes,no)=>{
              //console.log("res.status = ",res.status);
              if(res.status == 200){
                yes(newFiddleId);
              }
              else{
                no(-1);
              }
            })          
          });
        });
  
      })
      );
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
  deleteAllGists(){
    octokit.request('GET /gists?_='+(new Date).getTime(),{
      public:false
    }).then((res)=>{
      //console.log("get all gists res = ", res);
      res.data.forEach((oneGist)=>{
        if(oneGist.files["myfiddle_db.json"] === undefined){
          octokit.request('DELETE /gists/'+oneGist.id,{
            gist_id:oneGist.id
          }).then((res)=>{
            //console.log("deleted gist with id = ", oneGist.id);
          });
        }
        else{
          octokit.request('PATCH /gists/'+oneGist.id,{ //insert new fiddleGistData in myfiddle_db.json gists array and return the final promise
            gist_id:oneGist.id,
            files:{ "myfiddle_db.json": { content: "{}" } },
          });
        }
      });
    })
  }
}