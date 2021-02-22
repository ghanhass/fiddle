import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  ressourcesQueryString: string;

  constructor() { }

  onRessourcesQueryStringChange(event){
    console.log("onRessourcesQueryStringChange event = ",event);
  }

  ngOnInit(): void {
  }

}
