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

  constructor(private http: HttpClient) { }

  saveFiddle(data: any): Observable<any>{
    return (this.http.post(this.url, data,this.httpOptions));
  }
  getFiddle(data: any): Observable<any>{
    return (this.http.post(this.url, data, this.httpOptions));
  }
}
