import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Cdnjsdata } from './cdnjsdata';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RessourcesService {

  isDataCached: boolean = false;
  cachedRessourcesData: Cdnjsdata;
  cacheTimedOut: boolean = false;
  versionsCache: Array<string>=[];

  constructor(private http:HttpClient) {

    setInterval(()=>{//refresh cdn results every 6 hours within application usage duration without page reload
      this.cacheTimedOut = true;
    },3600000 * 6);
  }

  getRessourcesBySearch(searchString:string):Observable<Cdnjsdata>{
    return this.http.get<Cdnjsdata>("https://api.cdnjs.com/libraries?search="+searchString+"&fields=name,description,version&limit=20");
  }

  getRessources():Observable<Cdnjsdata>{
    let newRessources : Observable<Cdnjsdata> = this.http.get<Cdnjsdata>("https://api.cdnjs.com/libraries?fields=name,description,version").pipe(tap((res)=>{
      if (!this.isDataCached){
        this.isDataCached = true;
        this.cacheTimedOut = false;
        this.cachedRessourcesData = res;
      }  
      return res;
    }));
    
    if(this.cacheTimedOut){
      return newRessources;
    }
    else{
      if(this.isDataCached){
        return of(this.cachedRessourcesData).pipe(tap((res)=>{
          this.cacheTimedOut = false;
          return res;
        }));
      }
      else{
        return newRessources;
      }
    }
  }

  getRessourceVersions(ressourceName):Observable<Cdnjsdata>{
    let newRessources : Observable<Cdnjsdata> = this.http.get<Cdnjsdata>("https://api.cdnjs.com/libraries/"+ressourceName+"/?fields=versions").pipe(tap((res)=>{
      if (!this.isDataCached){
        this.isDataCached = true;
        this.cacheTimedOut = false;
        this.cachedRessourcesData = res;
      }  
      return res;
    }));
    
    if(this.cacheTimedOut){
      return newRessources;
    }
    else{
      if(this.isDataCached){
        return of(this.cachedRessourcesData).pipe(tap((res)=>{
          this.cacheTimedOut = false;
          return res;
        }));
      }
      else{
        return newRessources;
      }
    }
  }

}
