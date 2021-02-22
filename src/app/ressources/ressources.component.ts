import { Component, OnInit } from '@angular/core';
import { RessourcesService } from '../ressources.service';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string;

  constructor(private ressoueceService: RessourcesService) { }

  onRessourcesQueryStringChange(event){
    console.log("onRessourcesQueryStringChange event = ",event);
    this.ressoueceService.getRessources().subscribe((res)=>{
      console.log("res = ", res);
    });
  }

  ngOnInit(): void {
  }

}
