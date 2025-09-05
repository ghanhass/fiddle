import { Component, OnInit, HostListener, EventEmitter,Output, ViewChild } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { LoaderComponent } from '../loader/loader.component';
import { CdnjsLibraryMetaData } from '../cdnjs-meta-data';
import { CdnjsLibrariesSearchResult } from '../cdnjs-libraries-search-result';
import { CdnjsLibraryData } from '../cdnjs-library-data';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface SelectedRessourceAsset{
  ressourceName: string;
  asset:string;
  version:string;
  latest:string;
  latestVersion:string;
  placeholderMode:boolean;
}

@Component({
  standalone: true,
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css'],
  imports: [FormsModule, CommonModule, LoaderComponent]
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string = "";
  ressourcesChoiceFilesSearchString: string = "";
  availableRessources: Array<CdnjsLibraryData> = [];

  currentRessourceChoice: CdnjsLibraryData = {
    name:"",
    version:"",
    latest:"",
    description:""
  };
  currentRessourceVersions: string[] = [];
  currentRessourceVersion: string = "";
  currentRessourceAssetsByVersion: Array<string> = [];
  currentRessourceMetaData: CdnjsLibraryMetaData = {};
  
  selectedRessourceAssets: Array<SelectedRessourceAsset> = [];

  @Output()hidemodal:EventEmitter<any> = new EventEmitter();

  @Output()validate:EventEmitter<Array<string>> = new EventEmitter();

  @ViewChild("loader")loader:LoaderComponent = new LoaderComponent();
  
  assetIndexDragstart: number = 0;

  ressoucesMobileTab: string = "browse";

  ressourceSearchTerm = new Subject<string>();
  ressourceSearchOperation: Observable<CdnjsLibrariesSearchResult> = new Subject();

  constructor(private ressourcesService: RessourcesService) {}

  


  onRessourcesQueryStringChange(str: string){
    let searchString = str.trim().toUpperCase();
    if(searchString.length){ 
      this.loader.showLoader();
      this.ressourceSearchTerm.next(searchString);
    }
  }

  onRessourcesChoiceClick(ressource:CdnjsLibraryData){
    let currentRessourceName = this.currentRessourceChoice.version;    

    if(currentRessourceName != ressource.name){
      this.loader.showLoader();
      
      this.currentRessourceAssetsByVersion = [];
      this.ressourcesChoiceFilesSearchString = "";

      this.currentRessourceChoice = ressource;
      this.ressourcesService.getRessourceMetaData(ressource.name!).subscribe((res)=>{
        //console.log("getRessourceMetaData res = ", res);
        //console.log("currentRessourceChoice = ", this.currentRessourceChoice);
        this.currentRessourceMetaData = res;
        this.currentRessourceVersions = this.currentRessourceMetaData.versions || [];
        this.currentRessourceVersion = ressource.version || '';//main latest version of the clicked ressource of course.
        this.setCurrentRessourceAssetsByVersion(ressource.version || '')
        
        this.loader.hideLoader();
      });
    }

    
  }

  setCurrentRessourceAssetsByVersion(ressourceVersion: string){
    let assetsPerVersion = this.currentRessourceMetaData.assets?.filter((assetData)=>{
      return assetData.version == ressourceVersion;      
    });
    if(assetsPerVersion?.length){
      this.currentRessourceAssetsByVersion = assetsPerVersion[0].files || [];
    }
    else{

      //this.currentRessourceAssetsByVersion =  this.currentRessourceMetaData.assets[this.currentRessourceMetaData.assets.length - 1].files;
      //this.currentRessourceVersion = this.currentRessourceMetaData.assets[this.currentRessourceMetaData.assets.length - 1].version;
      this.loader.showLoader();
      this.ressourcesService.getRessourceAssets(this.currentRessourceChoice.name!, ressourceVersion).subscribe((res)=>{
        this.currentRessourceAssetsByVersion = res.files || [];
        this.loader.hideLoader()
      })

    }
  }

  onCurrentRessourceChoiceVersionChange(ressourceVersion: string){
    //console.log("onCurrentRessourceChoiceVersionChange ressourceVersion = ", ressourceVersion);
    this.setCurrentRessourceAssetsByVersion(ressourceVersion);
  }

  @HostListener("window:keyup",["$event"])
  onComponentKeyup(event:KeyboardEvent){
    //console.log("keyup event = ", event);
    if(event.key == "Escape"){
      this.hidemodal.emit();
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

  onRessourcesChoiceFilesSearchStringChange(str: string){
    //console.log("ressourcesChoiceFilesSearchString = ", this.ressourcesChoiceFilesSearchString);
    //console.log("str = ", str);
  }

  getFilteredcurrentRessourceAssetsByVersion(datasetArr: Array<string>, searchStr: string){
    return datasetArr.filter((srcStr: string)=>{
      if(srcStr.length >= 4){
        if(srcStr.substring(srcStr.length - 4) == ".css" || srcStr.substring(srcStr.length - 3) == ".js"){
          return true;
        }
      }
      return false;
    }).filter((srcStr)=>{
      return this.ressourcesService.searForString(srcStr, searchStr);
    });
  }

  onSelectRessourceAsset(asset: string, ressource:CdnjsLibraryData){
    //console.log("onSelectRessourceAsset data = ", asset);

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
        ressourceName: ressource.name || "", 
        asset: asset, 
        version:this.currentRessourceVersion, 
        latest:ressource.latest || "", 
        latestVersion: ressource.version || "",
        placeholderMode: false
      });
    }
    else{ //remove it otherwise
      this.selectedRessourceAssets.splice(assetIndex, 1);
    }

  }

  isRessourceAssetSelected(asset: string, ressource:CdnjsLibraryData){
    return this.selectedRessourceAssets.filter((el)=>{
      return el.asset == asset && el.ressourceName == ressource.name && el.version == this.currentRessourceVersion
    }).length > 0;
  }

  ressourceChoiceSelectedAssetDrop(event: DragEvent){
    //console.log("ressourceChoiceSelectedAssetDrop event.target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    //evTarget.style.backgroundColor = "red";
    let assetIndex = parseInt(evTarget.dataset["index"]!);
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
    event.dataTransfer?.setData('text',"");
    //console.log("ressourceChoiceSelectedAssetDragstart event = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    this.assetIndexDragstart = parseInt(evTarget.dataset["index"]!);
  }

  ressourceChoiceSelectedAssetDragenter(event:DragEvent){
    //console.log("ressourceChoiceSelectedAssetDragenter target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    //evTarget.classList.add("placeholder");
    let index = parseInt(evTarget.dataset['index']!);
    this.selectedRessourceAssets[index].placeholderMode = true;
  }

  ressourceChoiceSelectedAssetDragleave(event:DragEvent){
    //console.log("ressourceChoiceSelectedAssetDragleave target = ", event.target);
    let evTarget: HTMLElement = event.target as HTMLElement;
    //evTarget.classList.remove("placeholder");
    let index = parseInt(evTarget.dataset['index']!);
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
    this.ressourceSearchOperation = this.ressourceSearchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchString)=>{
        return this.ressourcesService.getRessourcesBySearch(searchString)
      })
    );

    this.ressourceSearchOperation.subscribe({
      next: (res)=>{
        this.availableRessources = res.results;
        this.loader.hideLoader();
      },
      error: (error)=>{
        this.loader.hideLoader();
      }
    });
  }

}
