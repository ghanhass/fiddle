import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone:true
})
export class SafePipe implements PipeTransform {

  constructor(protected _sanitizer: DomSanitizer){

  }

  transform(value: string, type:string): SafeResourceUrl {
    if(type == "url"){
      return this._sanitizer.bypassSecurityTrustResourceUrl(value);
    }
    return "";
  }

}
