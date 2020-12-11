import { Injectable } from '@angular/core';
import { UserCode } from "./user-code";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment} from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  httpOptions = {
    headers: new HttpHeaders({"Content-Type":"text/plain"}),
    responseType: 'text' as 'text'
  }
  url: string = environment.url;

  constructor(private http: HttpClient) { }

  saveCode(): Observable<any>{
    let data = {"save": "1"};
    return (this.http.post(this.url, data,this.httpOptions));
  }
}
