import { Injectable } from '@angular/core';
import { UserCode } from "./user-code";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }
  url: string = "http://localhost/iframe-renderer";

  constructor(private http: HttpClient) { }

  shareCode(data: UserCode){
    return (this.http.post(this.url, JSON.stringify(data),this.httpOptions));
  }
}
