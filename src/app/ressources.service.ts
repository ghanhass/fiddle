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

  constructor(private http:HttpClient) { }

  getRessourcesBySearch(searchString:string):Observable<Cdnjsdata>{
    return this.http.get<Cdnjsdata>("https://api.cdnjs.com/libraries?search="+searchString+"&fields=name,description,version&limit=20");
  }

  getRessources():Observable<Cdnjsdata>{
    if(this.isDataCached){
      return of(this.cachedRessourcesData);
    }
    else{

    }
    return this.http.get<Cdnjsdata>("https://api.cdnjs.com/libraries?fields=name,description,version").pipe(tap((res)=>{
      if (!this.isDataCached){
        this.isDataCached = true;
        this.cachedRessourcesData = res;
      }  
      return res;
    })
    );
  }

}
