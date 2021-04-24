import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  redirectAfterSaveMode: boolean = false;
  jsCode: string = "";
  cssCode: string = "";
  htmlCode: string = "";
  constructor() { }
}
