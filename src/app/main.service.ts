import { Injectable } from '@angular/core';
import { UserCode } from "./user-code";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment} from "../environments/environment";

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
  isFiddleThemeDark: boolean = false;

  fiddleTitle:string = "";
  redirectAfterSaveMode: boolean = false;

  isCtrlKeyOn: boolean = false;
  isAltKeyOn: boolean = false;
  canEmitCodeMsg: boolean = true;
  codeExecutionDate: Date =  undefined;
  
  constructor(private http: HttpClient) { }

  saveFiddle(data: any): Observable<any>{
    //console.log("saveFiddle data = ", data);
    return (this.http.post(this.url, data,this.httpOptions));
  }
  getFiddle(data: any): Observable<any>{
    return (this.http.post(this.url, data, this.httpOptions));
  }

  registerMonacoCustomTheme(base) {
    let self = this;
    setTimeout(()=>{
      window['monaco'].editor.defineTheme('myCustomTheme', {
        base: base, // can also be vs or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
          {
            token: 'comment',
            foreground: 'ffa500',
            fontStyle: 'italic underline'
          },
          { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
          { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
        ],
        colors: {}
      });
      window['monaco'].editor.setTheme("myCustomTheme");
    },10);
  }
}
