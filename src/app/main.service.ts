import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  concat,
  forkJoin,
  from,
  merge,
  Observable,
  of,
  Subject,
  zip,
} from 'rxjs';
import { environment } from '../environments/environment';
import { FiddleTheme } from './models/fiddle-theme';
import { FiddleData } from './models/fiddle-data';
import { catchError, map, mergeMap, tap, timestamp } from 'rxjs/operators';
import { CssPartComponent } from './css-part/css-part.component';
import { HtmlPartComponent } from './html-part/html-part.component';
import { JsPartComponent } from './js-part/js-part.component';
import { PastebinComponent } from './pastebin/pastebin.component';

let headers = new HttpHeaders();
headers = headers.set(
  'PRIVATE-TOKEN',
  window.atob(
    "Z2xwYXQtNEJXYVR4VFl5UlB0VW1BbjhuRExQRzg2TVFwMU9tdHlObTk2Q3cuMDEuMTIxaG9hdjJl" 
  )
);
headers = headers.set('Content-Type', 'application/json');

const gitlabProjectId = '52190204';
const gitlabJsonDbId = '3621546';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  jsCode: string;
  cssCode: string;
  htmlCode: string;
  isConsoleOn: boolean = false;
  pastebinText: string = '';

  appMode: string = 'fiddle';

  isFirstTimeFiddle: boolean = true;

  jsCodeSinceSave: string = '';
  cssCodeSinceSave: string = '';
  htmlCodeSinceSave: string = '';
  pastebinTextSinceSave: string = '';

  layout: number = 1;

  cssCodePartSize: number = 0;
  htmlCodePartSize: number = 0;
  jsCodePartSize: number = 0;
  mainContainerHeight: number = 0;
  mainContainerWidth: number = 0;
  codePartsSize: number = 0;
  iframeResizeValue: number = 0;
  fiddleThemeId: string = '';
  fiddleCreatedAt: number = 0;

  fiddleTitle: string = '';
  redirectAfterSaveMode: boolean = false;

  codeSavingDate: Date = new Date();

  showHtml: boolean = true;
  showCss: boolean = false;
  showJs: boolean = false;
  showResult: boolean = true;
  isMobileMode: boolean = false;

  scheduledRunFiddle: boolean = false;

  isBeforeUnloadEvHandlerSet: boolean = false;

  selectedTheme: FiddleTheme = {
    name: 'VS',
    id: 'vs-default',
    data: {
      base: 'vs',
      inherit: true,
      rules: [
        {
          foreground: '333333',
          background: 'ffffff',
          token: '',
        },
      ],
      colors: {
        'editor.foreground': '#333333',
        'editor.background': '#FFFFFF',
        'editor.selectionBackground': '#d2d2d2',
        'editor.lineHighlightBackground': '#FFFFFF',
        'editorCursor.foreground': '#333333',
        'editorWhitespace.foreground': '#333333',
        'editor.cursorBlinkShadow': '#000f867a',
      },
    },
  };

  themesList: Array<FiddleTheme> = [
    {
      name: 'VS',
      id: 'vs-default',
      data: {
        base: 'vs',
        inherit: true,
        rules: [
          {
            foreground: '333333',
            background: 'ffffff',
            token: '',
          },
        ],
        colors: {
          'editor.foreground': '#333333',
          'editor.background': '#FFFFFF',
          'editor.selectionBackground': '#d2d2d2',
          'editor.lineHighlightBackground': '#FFFFFF',
          'editorCursor.foreground': '#333333',
          'editorWhitespace.foreground': '#333333',
          'editor.cursorBlinkShadow': '#000f867a',
        },
      },
    },
    {
      name: 'VS Dark',
      id: 'vs-default-dark',
      data: {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.foreground': '#d4d4d4',
          'editor.background': '#1e1e1e',
          'editor.selectionBackground': '#414141',
          'editor.lineHighlightBackground': '#1e1e1e',
          'editorCursor.foreground': '#d4d4d4',
          'editorWhitespace.foreground': '#d4d4d480',
          'editor.cursorBlinkShadow': '#ffffff7a',
        },
      },
    },
  ];

  private appConfig: any;

  newFiddleIdSubject: Subject<number> = new Subject();

  public beforeUnloadListener: any = (event: BeforeUnloadEvent): any => {
    event.preventDefault();
    //console.log("beforeUnload event is set");
    if (this.isCodeChanged()) {
      return (event.returnValue = 'Are you sure you want to exit?');
    }
  };
  ctrlEnterMode: boolean = false;
  envVars: {
    production?: boolean;
    url?: string;
    appName?: string;
    homeUrl?: string;
    fiddleIframeOrigin?: string;
  } = {};

  constructor(private http: HttpClient) {
    this.initEnv();
    this.jsCode = '';
    this.cssCode = '';
    this.htmlCode = '';

    //console.log("mainService constructor");
  }

  setCheckBeforeUnloadListener() {
    let self = this;
    window.removeEventListener('beforeunload', self.beforeUnloadListener, {
      capture: true,
    });

    if (this.isCodeChanged()) {
      //console.log("isCodeChanged = true");
      window.addEventListener('beforeunload', self.beforeUnloadListener, {
        capture: true,
      });
    } else {
      //console.log("isCodeChanged = false");
      window.removeEventListener('beforeunload', self.beforeUnloadListener, {
        capture: true,
      });
    }
  }

  removeBeforeUnloadListener() {
    let self = this;
    window.removeEventListener('beforeunload', self.beforeUnloadListener, {
      capture: true,
    });
  }

  initConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('assets/app-config.json').subscribe({
        next: (res: any) => {
          this.appConfig = res;
          //console.log("startup this.appConfig = ", this.appConfig);
          resolve(res);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  initEnv(): void {
    let isProd = location.origin == 'https://ghanhass.github.io';
    this.envVars = {
      production: isProd,
      url: isProd
        ? 'https://hassoon-github.github.io/myfiddlepreview'
        : 'http://localhost/myfiddlepreview',
      appName: isProd ? 'myfiddle' : '',
      homeUrl: isProd
        ? 'https://ghanhass.github.io/myfiddle/'
        : 'http://localhost:4200',
      fiddleIframeOrigin: isProd
        ? 'https://hassoon-github.github.io'
        : 'http://localhost',
    };
  }

  getConfig(key: string) {
    return this.appConfig[key];
  }

  onEditorKeyDown(
    event: KeyboardEvent,
    codePartComponent: HtmlPartComponent | CssPartComponent | JsPartComponent
  ) {
    /*console.log('onEditorKeyDown event = ', event);

    let isCtrlPressed = event.code == 'ControlLeft';

    if (isCtrlPressed) {
      this.ctrlEnterMode = true;
      codePartComponent.codeMirrorEditor.setReadonly(true);
    }

    console.log('this.mainService.ctrlEnterMode = ', this.ctrlEnterMode);*/
  }

  onEditorKeyUp(
    event: KeyboardEvent,
    codePartComponent: HtmlPartComponent | CssPartComponent | JsPartComponent
  ) {
    /*
    let isCtrlReleased = event.code == 'ControlLeft';

    if (this.ctrlEnterMode && isCtrlReleased) {
      this.ctrlEnterMode = false;
      codePartComponent.codeMirrorEditor.setReadonly(false);
    }

    console.log('this.mainService.ctrlEnterMode = ', this.ctrlEnterMode);
    */
  }

  /**
   *
   * @returns boolean: Returns whether the code is changed or not since last save
   */
  isCodeChanged(): boolean {
    return (
      this.jsCode !== this.jsCodeSinceSave ||
      this.cssCode !== this.cssCodeSinceSave ||
      this.htmlCode !== this.htmlCodeSinceSave ||
      this.pastebinText !== this.pastebinTextSinceSave
    );
  }

  /**
   * Reset code marked since last save to the current code
   */
  resetCodeSinceSave() {
    this.jsCodeSinceSave = this.jsCode;
    this.cssCodeSinceSave = this.cssCode;
    this.htmlCodeSinceSave = this.htmlCode;
    this.pastebinTextSinceSave = this.pastebinText;
  }

  resumeFiddleTheme(
    htmlPartComp?: HtmlPartComponent,
    cssPartComp?: CssPartComponent,
    jsPartComp?: JsPartComponent,
    pastebinPart?: PastebinComponent
  ) {
    //console.log("param = ", param);
    //console.log("this.mainService.isFiddleThemeDark = ", this.isFiddleThemeDark);
    let savedThemeId = localStorage.getItem('myfiddle-theme');

    if (savedThemeId) {
      this.selectedTheme = this.themesList.find((el) => {
        return el.id == savedThemeId;
      })!;
    }
    //console.log("selectedTheme = ", selectedTheme);

    this.addThemeStylesheet(this.selectedTheme);

    if (htmlPartComp) {
      htmlPartComp.codeMirrorEditor.setTheme(
        savedThemeId
          ? savedThemeId == 'vs-default-dark'
            ? 'dark'
            : 'light'
          : 'light'
      );
    }

    if (cssPartComp) {
      cssPartComp.codeMirrorEditor.setTheme(
        savedThemeId
          ? savedThemeId == 'vs-default-dark'
            ? 'dark'
            : 'light'
          : 'light'
      );
    }

    if (jsPartComp) {
      jsPartComp.codeMirrorEditor.setTheme(
        savedThemeId
          ? savedThemeId == 'vs-default-dark'
            ? 'dark'
            : 'light'
          : 'light'
      );
    }

    if (pastebinPart) {
      pastebinPart.codeMirrorEditor.setTheme(
        savedThemeId
          ? savedThemeId == 'vs-default-dark'
            ? 'dark'
            : 'light'
          : 'light'
      );
    }
  }

  prepareThemeStyleSheet(theme: FiddleTheme) {
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
        box-shadow: 0 0 0px 1px ${
          theme.data.colors['editor.background']
        } !important;
    }
    
    .layout.active {
        background-color: ${
          theme.data.colors['editor.selectionBackground']
        } !important;
        border-color: ${theme.data.colors['editor.foreground']} !important;
        box-shadow: 0 0 6px 2px ${
          theme.data.colors['editor.foreground']
        } !important;
    }
    
    .layouts-list {
        background-color: ${theme.data.colors['editor.background']} !important;
        box-shadow: 0px 0px 4px 2px ${
          theme.data.colors['editor.foreground']
        } !important;
    }
    
    ul.donations-menu.shown,
    .themes-menu.shown{
        box-shadow: 0px 0px 4px 2px ${
          theme.data.colors['editor.foreground']
        } !important;
        background-color: ${theme.data.colors['editor.background']} !important;
    }
    
    .paypal-btn-container ul.donations-menu > li,
    .themes-menu.shown > li {
        color: ${theme.data.colors['editor.foreground']};
    }
    
    .paypal-btn-container ul.donations-menu > li:hover,
    .themes-menu.shown > li:not(.selected):hover {
        background-color: ${this.enhanceThemesMenuColoration(
          theme,
          'background-color'
        )};
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
        background-color: ${
          theme.data.colors['editor.lineHighlightBackground']
        };
        font-weight: 600;
    }
    
    .themes-menu.shown > li:not(.selected):hover {
        /*background-color: ${
          theme.data.colors['editor.lineHighlightBackground']
        };*/
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
        background-color: ${
          theme.data.colors['editor.lineHighlightBackground']
        };
    }

    app-modal .modal-header .modal-validate-btn{
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
        border-color: ${theme.data.colors['editor.foreground']};
    }

    app-modal .modal-header .modal-validate-btn:hover{
        background-color: ${
          theme.data.colors['editor.lineHighlightBackground']
        };
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
        background-color: ${
          theme.data.colors['editor.lineHighlightBackground']
        };
    }
    
    body{
        background-color: ${theme.data.colors['editor.background']};
        color: ${theme.data.colors['editor.foreground']};
    }

    .code-part-title.half-stretch-mark{
      box-shadow: 0 0 10000px 10000px ${
        theme.data.colors['editor.selectionBackground']
      };
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
      box-shadow: 0px 0px 3px 1px ${
        theme.data.colors['editor.cursorBlinkShadow']
      };
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

    .code-component-container{
      background-color: ${theme.data.colors['editor.background']}
    }

    @keyframes blink{
      0%{
        box-shadow: none;
      }
  
      50%{
        box-shadow: inset 0px 0px 6px 3px ${
          theme.data.colors['editor.cursorBlinkShadow']
        };
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
            box-shadow: 0 0 10000px 10000px ${
              theme.data.colors['editor.selectionBackground']
            };
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

  addThemeStylesheet(theme: FiddleTheme) {
    let themeStylesheet = document.querySelector(
      'style#theme-stylesheet'
    ) as HTMLStyleElement;
    if (themeStylesheet) {
      themeStylesheet.remove();
    }

    themeStylesheet = document.createElement('style');
    themeStylesheet.id = 'theme-stylesheet';
    document.head.appendChild(themeStylesheet);
    themeStylesheet.textContent = this.prepareThemeStyleSheet(theme);
  }

  enhanceThemesMenuColoration(theme: FiddleTheme, cssProperty: string) {
    if (theme.id == 'vs-default') {
      switch (cssProperty) {
        case 'background-color':
          return 'rgba(128, 128, 128, 0.11)';
      }
    } else if (theme.id == 'vs-default-dark') {
      switch (cssProperty) {
        case 'background-color':
          return '#333333';
      }
    } else {
      return theme.data.colors['editor.lineHighlightBackground'];
    }
  }

  generateFiddleCode(data: any): string {
    //console.log("generateFiddleCode data.isConsoleOn: ", this.isConsoleOn);
    let htmlCode = data.html ? data.html : '';
    let cssCode = data.css ? data.css : '';
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

  getFiddlesList(page?: number): Observable<any> {
    //console.log("getFiddle fiddleId = ",fiddleId);
    let self = this;
    let str = '';
    if (this.envVars.production) {
      str = page ? '&page=' + page : '';
      let promise = new Promise((resolve, reject) => {
        let gitlabRawSnippetUrl =
          `https://gitlab.com/api/v4/projects/${gitlabProjectId}/snippets?per_page=30` +
          str;
        this.http
          .get<any>(gitlabRawSnippetUrl, { headers: headers })
          .subscribe({
            //get seeked fiddle content from gitlab
            next: (res2: FiddleData) => {
              let result = res2;
              resolve(result);
            },
            error: (error2) => {
              resolve({
                status: 'not found',
              });
            },
          });
      });
      return from(promise);
    } else {
      str = page ? '&_page=' + page : '';
      return this.http.get<Array<FiddleData>>(
        'http://localhost:3000/gists?per_page=30' + str
      );
    }
  }

  getFiddle(fiddleId: number): Observable<any> {
    //console.log("getFiddle fiddleId = ",fiddleId);
    let self = this;

    if (this.envVars.production) {
      let promise = new Promise((resolve, reject) => {
        let gitlabRawSnippetUrl = `https://gitlab.com/api/v4/projects/${gitlabProjectId}/snippets/${fiddleId}/raw`;
        this.http
          .get<any>(gitlabRawSnippetUrl, { headers: headers })
          .subscribe({
            //get seeked fiddle content from gitlab
            next: (res2: FiddleData) => {
              let result;
              if (
                res2.hasOwnProperty('css') &&
                res2.hasOwnProperty('js') &&
                res2.hasOwnProperty('html')
              ) {
                result = {
                  status: 'ok',
                  fiddleData: res2,
                };
              } else {
                result = {
                  status: 'not found',
                };
              }
              resolve(result);
            },
            error: (error2) => {
              resolve({
                status: 'not found',
              });
            },
          });
      });
      return from(promise);
    } else {
      return this.http
        .get<Array<FiddleData>>('http://localhost:3000/gists?id=' + fiddleId)
        .pipe(
          map((value: Array<FiddleData>) => {
            if (value.length) {
              return {
                status: 'ok',
                fiddleData: value[0],
              };
            } else {
              return {
                status: 'not found',
              };
            }
          })
        );
    }
  }

  saveFiddle(fiddleData: FiddleData): Observable<any> {
    //let html = this.generateFiddleCode(fiddleData);
    let self = this;
    if (this.envVars.production) {
      let timeStamp = new Date().getTime();
      let body = {
        file_name: fiddleData.appMode + '_' + timeStamp,
        title: fiddleData.title ? fiddleData.title : 'Noname',
        visibility: 'public',
        content: JSON.stringify(fiddleData),
        file_path: timeStamp,
      };
      let newSnippetRawUrl;
      let newFiddleId;

      let promise = new Promise((resolve, reject) => {
        this.http
          .post<any>(
            'https://gitlab.com/api/v4/projects/52190204/snippets',
            body,
            { headers: headers }
          )
          .subscribe({
            next: (res1) => {
              //console.log("res1 = ", res1);
              newSnippetRawUrl = `https://gitlab.com/api/v4/projects/${gitlabProjectId}/snippets/${res1.id}/raw`;
              newFiddleId = res1.id;
              resolve(newFiddleId);
            },
            error: (err1) => {
              reject(err1);
            },
          });
      });
      return from(promise);
    } else {
      return from(
        new Promise((resolve, reject) => {
          this.http
            .get<Array<FiddleData>>('http://localhost:3000/gists?_sort=id')
            .subscribe(
              (res) => {
                let newId;

                console.log('res = ', res);

                if (res.length) {
                  let lastId = +res[res.length - 1].id!;
                  newId = lastId + 1;
                } else {
                  newId = 1;
                }
                fiddleData.id = newId;

                console.log('fiddleData = ', fiddleData);
                this.http
                  .post('http://localhost:3000/gists', fiddleData)
                  .subscribe((res2) => {
                    resolve(newId);
                  });
              },
              (error) => {
                reject(-1);
              }
            );
        })
      );
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
