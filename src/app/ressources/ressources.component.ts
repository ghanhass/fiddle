import { Component, OnInit, HostListener, EventEmitter,Output, ViewChild } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { Cdnjsdata } from '../cdnjsdata';
import { CdnjsSearchResult } from '../cdnjs-result';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string;
  availableRessources: Array<CdnjsSearchResult> = [];
  currentRessourceChoice: CdnjsSearchResult = {
    name:"",
    version:"",
    latest:"",
    description:""
  };
  currentRessourceVersions: [string];

  @Output()hidemodal:EventEmitter<any> = new EventEmitter();
  @ViewChild("loader")loader:LoaderComponent;

  constructor(private ressourcesService: RessourcesService) {}

  filterRessources(dataSet: Cdnjsdata, searchString: string){

    let results = dataSet.results;
    let filteredResults = results.filter((result)=>{
      if(result.name.toUpperCase().includes(searchString.toUpperCase())){
        return true;
      }
      return false;
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
    this.loader.showLoader();
    this.ressourcesService.getRessources().subscribe((res)=>{
      //console.log("res = ", res);
      this.filterRessources(res, searchString.trim());
      this.loader.hideLoader();
    });
  }

  onRessourcesChoiceClick(ressource:CdnjsSearchResult){
    this.currentRessourceChoice = ressource;
    this.loader.showLoader();
    this.ressourcesService.getRessourceVersions(ressource.name).subscribe((res)=>{
      console.log("getRessourceVersions res = ", res);
      console.log("currentRessourceChoice = ", this.currentRessourceChoice);
      this.currentRessourceVersions = res.versions;
      this.loader.hideLoader();
    });
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
  }

  ngOnInit(): void {
  }

}
