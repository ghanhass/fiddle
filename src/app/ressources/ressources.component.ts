import { Component, OnInit } from '@angular/core';
import { RessourcesService } from '../ressources.service';
import { Cdnjsdata } from '../cdnjsdata';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string;

  constructor(private ressoueceService: RessourcesService) { }

  filterRessources(dataSet: Cdnjsdata, searchString: string){
    console.log("dataSet = ", dataSet);
    console.log("searchString = ", searchString);
  }

  onRessourcesQueryStringChange(searchString: string){
    this.ressoueceService.getRessources().subscribe((res)=>{
      //console.log("res = ", res);
      this.filterRessources(res, searchString);
    });
  }

  ngOnInit(): void {
  }

}
