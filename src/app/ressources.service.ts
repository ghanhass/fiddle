import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CachedCdnjsMetaData } from './models/cached-cdnjs-meta-data';
import { filter, map, take, tap } from 'rxjs/operators';
import { CdnjsLibraryMetaData } from './models/cdnjs-meta-data';
import { CdnjsLibrariesSearchResult } from './models/cdnjs-libraries-search-result';
import { CdnjsLibraryAssets } from './models/cdnjs-library-assets';

@Injectable({
  providedIn: 'root'
})
export class RessourcesService {

  isDataCached: boolean = false;
  cachedRessourcesData: CdnjsLibrariesSearchResult = {results: []};
  cacheTimedOut: boolean = false;
  cachedCdnjsMetaData: Array<CachedCdnjsMetaData>=[];

  constructor(private http:HttpClient) {

    setInterval(()=>{//refresh cdn results every 6 hours within application usage duration without page reload
      
      this.cacheTimedOut = true;
      this.cachedRessourcesData = {results: []};
      this.cachedCdnjsMetaData = [];

    },3600000 * 6);
  }

  searForString(srcStr: string, searchStr: string){
    if(srcStr.toUpperCase() == searchStr.toUpperCase()){
      return true;
    }
    if(srcStr.toUpperCase().includes(searchStr.toUpperCase())){
      return true;
    }
    else{
      let strsArr = searchStr.split(" ");
      let counter = 0;
      for(var ind=0; ind < strsArr.length; ind++){
        let str = strsArr[ind];
        if(srcStr.toUpperCase().includes(str.toUpperCase())){
          counter++;
        }
      }
      if(counter == strsArr.length){
        return true;
      }
    }
    return false;
  }
  
  getRessourcesBySearch(searchString:string):Observable<CdnjsLibrariesSearchResult>{

      let newRessources = this.http.get<CdnjsLibrariesSearchResult>("https://api.cdnjs.com/libraries?search="+searchString+"&fields=name,description,version&limit=20").
      pipe(
        map((res)=>{
        let res2 = res;

        res2.results = res2.results.filter((libraryData)=>{
          return this.searForString(libraryData.name!, searchString);
        });

        res2.results.sort((a, b)=>{
          if(a.name!.length > b.name!.length){
            return 1;
          }
          else if(a.name!.length < b.name!.length){
            return -1;
          }
          else{
            if(a.name!.toUpperCase() > b.name!.toUpperCase()){
              return 1;
            }
            else{
              return -1;
            } 
          }
        });

        //console.log("network res2.results = ", res2.results);
        //console.log("------------------------");

        res2.results.forEach((libraryData)=>{
          let ind = this.cachedRessourcesData.results.findIndex((cachedLibraryData)=>{
            return cachedLibraryData.name?.toUpperCase() == libraryData.name?.toUpperCase();
          });

          if(ind === -1){//retrieved library/ressource is NOT present in the cached search result ? cache it
            this.cachedRessourcesData.results.push(libraryData);
          }
        });

        return res2;
      })
      );

      return newRessources;

  }

  getRessources():Observable<CdnjsLibrariesSearchResult>{
    let newRessources : Observable<CdnjsLibrariesSearchResult> = this.http.get<CdnjsLibrariesSearchResult>("https://api.cdnjs.com/libraries?fields=name,description,version").pipe(tap((res)=>{
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

  getRessourceMetaData(ressourceName: string):Observable<CdnjsLibraryMetaData>{
    let newRessourceMetaData : Observable<CdnjsLibraryMetaData> = this.http.get<CdnjsLibraryMetaData>("https://api.cdnjs.com/libraries/"+ressourceName+"?fields=assets,description,latest,name,versions").pipe(tap((res)=>{
      
      let ind = this.cachedCdnjsMetaData.findIndex((cachedLibraryMetaData)=>{
        return cachedLibraryMetaData.name?.toUpperCase() == res.name?.toUpperCase();
      });

      if(ind === -1){//retrieved library/ressource metaData is NOT present in the cached libraries metaDatas ?
        this.cachedCdnjsMetaData.push({
          name: ressourceName,
          cachedMetaData: res
        });
      }

    }));

    return newRessourceMetaData;
    /*
    let ind = this.cachedCdnjsMetaData.findIndex((cachedLibraryMetaData)=>{
      return cachedLibraryMetaData.name.toUpperCase().indexOf(ressourceName.trim().toUpperCase()) > -1
    });

    console.log("this.cachedCdnjsMetaData = ", this.cachedCdnjsMetaData);
    console.log("------------------------");

    if(ind > -1){//searched library/ressource i"s present in the cached search result ?
      return of(this.cachedCdnjsMetaData[ind]);
    }
    else{
      return newRessourceMetaData;
    } 
    */
  }

  getRessourceAssets(ressourceName: string, ressourceVersion: string){
    let libraryAssets = this.http.get<CdnjsLibraryAssets>("https://api.cdnjs.com/libraries/"+ressourceName+"/"+ressourceVersion);

    return libraryAssets;
  }

}
