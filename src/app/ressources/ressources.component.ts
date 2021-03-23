import { Component, OnInit, HostListener, EventEmitter,Output, ViewChild } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { Cdnjsdata } from '../cdnjsdata';
import { CdnjsSearchResult } from '../cdnjs-result';
import { LoaderComponent } from '../loader/loader.component';
import { CdnjsMetaData } from '../cdnjs-meta-data';
import { stripComments } from 'tslint/lib/utils';

interface selectedRessourceAsset{
  ressourceName: string;
  asset:string;
  version:string;
}

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
  
  selectedRessourceAssets: Array<selectedRessourceAsset> = [];

  @Output()hidemodal:EventEmitter<any> = new EventEmitter();
  @ViewChild("loader")loader:LoaderComponent;
  assetIndexDragstart: number;

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
    //this.selectedRessourceAssets = [];
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
    //this.selectedRessourceAssets = [];
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
    this.selectedRessourceAssets = [];
  }

  onRessourcesChoiceFilesSearchStringChange(str){
    console.log("ressourcesChoiceFilesSearchString = ", this.ressourcesChoiceFilesSearchString);
    console.log("str = ", str);
  }

  getFilteredcurrentRessourceAssetsByVersion(datasetArr, searchStr){
    return datasetArr.filter((srcStr: string)=>{
      if(srcStr.length >= 4){
        if(srcStr.substr(srcStr.length - 4) == ".css" || srcStr.substr(srcStr.length - 3) == ".js"){
          return true;
        }
      }
      return false;
    }).filter((srcStr)=>{
      return this.searForString(srcStr, searchStr);
    });
  }

  onSelectRessourceAsset(asset, ressource:CdnjsSearchResult){
    console.log("onSelectRessourceAsset data = ", asset);

    let assetIndex = undefined; 
    for(let ind = 0; ind < this.selectedRessourceAssets.length; ind++){
      let assetData =  this.selectedRessourceAssets[ind];
      if(assetData.asset == asset && assetData.ressourceName == ressource.name && assetData.version == this.currentRessourceVersion ){
        assetIndex = ind;
        break;
      }
    }
    if(assetIndex === undefined){
      this.selectedRessourceAssets.push({ressourceName: ressource.name, asset: asset, version:this.currentRessourceVersion});
    }
    else{
      this.selectedRessourceAssets.splice(assetIndex, 1);
    }

  }

  isRessourceAssetSelected(asset, ressource:CdnjsSearchResult){
    return this.selectedRessourceAssets.filter((el)=>{return el.asset == asset && el.ressourceName == ressource.name && el.version == this.currentRessourceVersion}).length > 0;
  }

  choiceFilesParentDrop(event){
    console.log("choiceFilesParentDrop event.target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    if(evTarget.classList.contains("ressources-choice-files")){
      //evTarget.style.backgroundColor = "red";
      let assetIndex = parseInt(evTarget.dataset.index);
      //console.log("assetIndex = ", assetIndex);
      let temp = this.currentRessourceAssetsByVersion[this.assetIndexDragstart];
      this.currentRessourceAssetsByVersion[this.assetIndexDragstart] = this.currentRessourceAssetsByVersion[assetIndex]
      this.currentRessourceAssetsByVersion[assetIndex] = temp;
    }
  }

  choiceFilesParentDragover(event:DragEvent){
    event.preventDefault();
  }

  onRessourceAssetDragstart(event:DragEvent){
    console.log("onRessourceAssetDragstart event = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    this.assetIndexDragstart = parseInt(evTarget.dataset.index);
  }

  ngOnInit(): void {
  }

}
