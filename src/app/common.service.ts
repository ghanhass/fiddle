import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  redirectMode: boolean = false;
  jsCode: string = "";
  cssCode: string = "";
  htmlCode: string = "";
  constructor() { }
}
