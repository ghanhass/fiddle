import { Component, OnInit, HostListener, EventEmitter,Output, ViewChild } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { Cdnjsdata } from '../cdnjsdata';
import { CdnjsSearchResult } from '../cdnjs-result';
import { LoaderComponent } from '../loader/loader.component';
import { CdnjsMetaData } from '../cdnjs-meta-data';
import { stripComments } from 'tslint/lib/utils';

interface SelectedRessourceAsset{
  ressourceName: string;
  asset:string;
  version:string;
  latest:string;
  latestVersion:string;
  placeholderMode:boolean;
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
  
  selectedRessourceAssets: Array<SelectedRessourceAsset> = [];

  @Output()hidemodal:EventEmitter<any> = new EventEmitter();

  @Output()validate:EventEmitter<Array<string>> = new EventEmitter();

  @ViewChild("loader")loader:LoaderComponent;
  
  assetIndexDragstart: number;

  ressoucesMobileTab: string = "browse";

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
    let assetsPerVersion = this.currentRessourceMetaData.assets.filter((ressourceMetaData)=>{
      return ressourceMetaData.version == ressourceVersion;      
    });
    if(assetsPerVersion.length){
      this.currentRessourceAssetsByVersion = assetsPerVersion[0].files;
    }
    else{
      this.currentRessourceAssetsByVersion =  this.currentRessourceMetaData.assets[this.currentRessourceMetaData.assets.length - 1].files;
      this.currentRessourceVersion = this.currentRessourceMetaData.assets[this.currentRessourceMetaData.assets.length - 1].version;
    }
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
      //this.resetCurrentRessourceChoice();
      //this.emptySelectedRessourceAssets();
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
    this.ressourcesChoiceFilesSearchString = "";
    this.availableRessources = [];
    this.currentRessourceAssetsByVersion = [];
  }

  emptySelectedRessourceAssets(){
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
    for(let ind = 0; ind < this.selectedRessourceAssets.length; ind++){ //see if selected-asset's index is already selected
      let assetData =  this.selectedRessourceAssets[ind];
      if(assetData.asset == asset && assetData.ressourceName == ressource.name && assetData.version == this.currentRessourceVersion ){
        assetIndex = ind;
        break;
      }
    }
    if(assetIndex === undefined){ //selected asset doesn't exist in selected assets array? push it
      this.selectedRessourceAssets.push({
        ressourceName: ressource.name, 
        asset: asset, 
        version:this.currentRessourceVersion, 
        latest:ressource.latest, 
        latestVersion: ressource.version,
        placeholderMode: false
      });
    }
    else{ //remove it otherwise
      this.selectedRessourceAssets.splice(assetIndex, 1);
    }

  }

  isRessourceAssetSelected(asset, ressource:CdnjsSearchResult){
    return this.selectedRessourceAssets.filter((el)=>{
      return el.asset == asset && el.ressourceName == ressource.name && el.version == this.currentRessourceVersion
    }).length > 0;
  }

  ressourceChoiceSelectedAssetDrop(event){
    console.log("ressourceChoiceSelectedAssetDrop event.target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    //evTarget.style.backgroundColor = "red";
    let assetIndex = parseInt(evTarget.dataset.index);
    //console.log("assetIndex = ", assetIndex);
    let temp = this.selectedRessourceAssets[this.assetIndexDragstart];
    this.selectedRessourceAssets[this.assetIndexDragstart] = this.selectedRessourceAssets[assetIndex]
    this.selectedRessourceAssets[assetIndex] = temp;
    this.selectedRessourceAssets.filter((el)=>{
      return el.placeholderMode;
    }).forEach((el)=>{
      el.placeholderMode = false;
    })
  }

  ressourceChoiceSelectedAssetDragover(event:DragEvent){
    event.preventDefault();
  }

  ressourceChoiceSelectedAssetDragstart(event:DragEvent){
    event.dataTransfer.setData('text',"");
    console.log("ressourceChoiceSelectedAssetDragstart event = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    this.assetIndexDragstart = parseInt(evTarget.dataset.index);
  }

  ressourceChoiceSelectedAssetDragenter(event:DragEvent){
    console.log("ressourceChoiceSelectedAssetDragenter target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    //evTarget.classList.add("placeholder");
    let index = parseInt(evTarget.dataset.index);
    this.selectedRessourceAssets[index].placeholderMode = true;
  }

  ressourceChoiceSelectedAssetDragleave(event:DragEvent){
    console.log("ressourceChoiceSelectedAssetDragleave target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    //evTarget.classList.remove("placeholder");
    let index = parseInt(evTarget.dataset.index);
    this.selectedRessourceAssets[index].placeholderMode = false;
  }

  getFullAssetUrl(selectedRessourceAsset: SelectedRessourceAsset){
    let latest = selectedRessourceAsset.latest;
    let version = selectedRessourceAsset.version;
    let asset = selectedRessourceAsset.asset;
    let arr = latest.split(selectedRessourceAsset.latestVersion);
    let url = "";
    if(arr.length){
      url = arr[0];
      url += version + "/" + asset;
    }
    return url;
  }

  removeSelectedRessourceAsset(selectedRessourceAsset: SelectedRessourceAsset){
    let assetIndex = this.selectedRessourceAssets.findIndex((el)=>{
      return el.ressourceName == selectedRessourceAsset.ressourceName &&
      el.version == selectedRessourceAsset.version && 
      el.asset == selectedRessourceAsset.asset
    })
    if(assetIndex !== -1){
      this.selectedRessourceAssets.splice(assetIndex, 1);
    }
  }

  validateRessources(){
    //validate ressources here
    let maxLength = 0;
    let selectedRessourceAssets = this.selectedRessourceAssets.map((el:SelectedRessourceAsset)=>{
      let srcStr = el.asset;
      let result = "";
      if(srcStr.substr(srcStr.length - 4) == ".css"){
        result = "<link rel='stylesheet' href='"+this.getFullAssetUrl(el)+"'>"+"\n";
      }
      else if(srcStr.substr(srcStr.length - 3) == ".js"){
        result =  "<script src='"+this.getFullAssetUrl(el)+"'></script>"+"\n";
      }
      return result;
    }).filter((el)=>{
      return el != "";
    });
    if(selectedRessourceAssets.length){
      selectedRessourceAssets.push("\n");
    }
    this.validate.emit(selectedRessourceAssets);
  }

  ngOnInit(): void {
  }

}
