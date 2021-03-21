import { Component, OnInit, HostListener, EventEmitter,Output, ViewChild } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { Cdnjsdata } from '../cdnjsdata';
import { CdnjsSearchResult } from '../cdnjs-result';
import { LoaderComponent } from '../loader/loader.component';
import { CdnjsMetaData } from '../cdnjs-meta-data';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string;
  ressourcesChoiceFilesSearchString: string;
  availableRessources: Array<CdnjsSearchResult> = [];
  currentRessourceChoice: CdnjsSearchResult = {
    name:"",
    version:"",
    latest:"",
    description:""
  };
  currentRessourceVersions: [string];
  currentRessourceVersion: string;
  currentRessourceAssetsByVersion: Array<string> = [];
  currentRessourceMetaData: CdnjsMetaData;

  @Output()hidemodal:EventEmitter<any> = new EventEmitter();
  @ViewChild("loader")loader:LoaderComponent;

  constructor(private ressourcesService: RessourcesService) {}

  searForString(srcStr, searchStr){
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

  filterRessources(dataSet: Cdnjsdata, searchString: string){

    let results = dataSet.results;

    let filteredResults = results.filter((result)=>{
      return this.searForString(result.name, searchString);
    }).sort((a, b)=>{
      if(a.name.length > b.name.length){
        return 1;
      }
      else if(a.name.length < b.name.length){
        return -1;
      }
      else{
        if(a.name.toUpperCase() > b.name.toUpperCase()){
          return 1;
        }
        else{
          return -1;
        } 
      }
    }).slice(0,150);
    this.availableRessources = filteredResults;

    console.log("filteredResults = ", filteredResults);
    console.log("searchString = ", searchString);
    console.log("---------------------------------");
  }

  onRessourcesQueryStringChange(searchString: string){
    if(searchString.trim().toUpperCase() != this.currentRessourceChoice.name.trim().toUpperCase()){
      this.resetCurrentRessourceChoice();
      this.loader.showLoader();
      this.ressourcesService.getRessources().subscribe((res)=>{
        //console.log("res = ", res);
        this.filterRessources(res, searchString.trim());
        this.loader.hideLoader();
      });
    }
  }

  onRessourcesChoiceClick(ressource:CdnjsSearchResult){
    this.currentRessourceChoice = ressource;
    this.loader.showLoader();
    this.currentRessourceAssetsByVersion = [];
    this.ressourcesChoiceFilesSearchString = "";
    this.currentRessourceVersion = "";
    this.ressourcesService.getRessourceMetaData(ressource.name).subscribe((res)=>{
      console.log("getRessourceMetaData res = ", res);
      console.log("currentRessourceChoice = ", this.currentRessourceChoice);
      this.currentRessourceMetaData = res;
      this.currentRessourceVersions = res.versions;
      this.currentRessourceVersion = ressource.version;
      this.setCurrentRessourceAssetsByVersion(ressource.version);
      this.loader.hideLoader();
    });
  }

  setCurrentRessourceAssetsByVersion(ressourceVersion){
    this.currentRessourceAssetsByVersion = this.currentRessourceMetaData.assets.filter((ressourceMetaData)=>{
      return ressourceMetaData.version == ressourceVersion;      
    })[0].files;
  }

  onCurrentRessourceChoiceVersionChange(ressourceVersion){
    console.log("onCurrentRessourceChoiceVersionChange ressourceVersion = ", ressourceVersion);
    this.setCurrentRessourceAssetsByVersion(ressourceVersion);
  }

  @HostListener("window:keyup",["$event"])
  onComponentKeyup(event){
    //console.log("keyup event = ", event);
    if(event.key == "Escape"){
      this.hidemodal.emit();
      this.resetCurrentRessourceChoice();
    }
  }

  resetCurrentRessourceChoice(){
    this.currentRessourceChoice = {
      name:"",
      version:"",
      latest:"",
      description:""
    }
    this.ressourcesQueryString = "";
    this.availableRessources = [];
    this.currentRessourceAssetsByVersion = [];
  }

  onRessourcesChoiceFilesSearchStringChange(str){
    console.log("ressourcesChoiceFilesSearchString = ", this.ressourcesChoiceFilesSearchString);
    console.log("str = ", str);
  }

  getFilteredcurrentRessourceAssetsByVersion(datasetArr, searchStr){
    return datasetArr.filter((srcStr)=>{
      return this.searForString(srcStr, searchStr);
    });
  }

  ngOnInit(): void {
  }

}
