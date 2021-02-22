import { Component, OnInit } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { Cdnjsdata } from '../cdnjsdata';
import { CdnjsResult } from '../cdnjs-result';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string;
  availableRessources: Array<CdnjsResult> = [];

  constructor(private ressoueceService: RessourcesService) { }

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
    });
    this.availableRessources = filteredResults;

    console.log("filteredResults = ", filteredResults);
    console.log("searchString = ", searchString);
    console.log("---------------------------------");
  }

  onRessourcesQueryStringChange(searchString: string){
    this.ressoueceService.getRessources().subscribe((res)=>{
      //console.log("res = ", res);
      this.filterRessources(res, searchString.trim());
    });
  }

  ngOnInit(): void {
  }

}
