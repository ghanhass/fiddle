import { Injectable } from '@angular/core';
import { UserCode } from "./user-code";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment} from "../environments/environment";
import { FiddleTheme } from './fiddle-theme';
import { FiddleThemeDetails } from './fiddle-theme-details';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"}),
    responseType: 'text' as 'text'
  }
  url: string = environment.url;
  jsCode:string = "";
  cssCode:string = "";
  htmlCode:string = "";
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

  defaultTheme = {
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
  
  private appConfig: any;
  
  constructor(private http: HttpClient) { }

  initConfig():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.http.get("assets/app-config.json").subscribe(
        (res:any)=>{
          this.appConfig = res;
          console.log("startup this.appConfig = ", this.appConfig);
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

  saveFiddle(data: any): Observable<any>{
    //console.log("saveFiddle data = ", data);
    return (this.http.post(this.url, data,this.httpOptions));
  }
  getFiddle(data: any): Observable<any>{
    return (this.http.post(this.url, data, this.httpOptions));
  }

  registerMonacoCustomTheme(fiddleTheme: FiddleTheme) {
    let self = this;
    //console.log("A!");
    setTimeout(()=>{
      if(window['monaco']){
        //console.log("fiddleTheme = ", fiddleTheme);
        window['monaco'].editor.defineTheme('myCustomTheme', fiddleTheme.data as any);
        window['monaco'].editor.setTheme("myCustomTheme");
      }
    },10);
  }

  resumeFiddleTheme(){
    //console.log("param = ", param);
    //console.log("this.mainService.isFiddleThemeDark = ", this.isFiddleThemeDark);
    let savedThemeId = localStorage.getItem("myfiddle-theme");
    let selectedTheme: FiddleTheme;

    if(savedThemeId){
        selectedTheme = this.getConfig("themesList").find((el)=>{return el.id == savedThemeId});
    }
    else{
        selectedTheme = this.defaultTheme;
    }
    //console.log("selectedTheme = ", selectedTheme);

    this.addThemeStylesheet(selectedTheme);
    this.registerMonacoCustomTheme(selectedTheme);
    
  }

  prepareThemeStyleSheet(theme: FiddleTheme){
    let str = `.code-part-title {
        background:${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .as-split-outer[class] > .as-split-gutter[class],
    .as-split-gutter-custom,
    #code-parts[id] .as-split-gutter[class]{
        background-color: ${theme.data.colors['editor.selectionBackground']};
    }
    
    .fiddle-size.fiddle-size-hack{
        color: ${theme.data.colors['editor.background']};
        background: ${theme.data.colors['editor.foreground']};
        box-shadow: 0 0 15px 4px ${theme.data.colors['editor.foreground']};
    }
    
    .iframe-hack {
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
    }`;

    return str;
  }

  addThemeStylesheet(theme: FiddleTheme){    
    let themeStylesheet = document.querySelector("style#theme-stylesheet") as HTMLStyleElement;
    
    if(themeStylesheet){
      themeStylesheet.parentElement.removeChild(themeStylesheet);
    }
    
    themeStylesheet = document.createElement("style");
    themeStylesheet.id = "theme-stylesheet";

    document.head.appendChild(themeStylesheet);

    themeStylesheet.textContent = theme ? this.prepareThemeStyleSheet(theme) : "";
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
}
