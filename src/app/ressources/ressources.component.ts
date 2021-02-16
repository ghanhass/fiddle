import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit {

  currentTab: string;

  constructor() { }

  ngOnInit(): void {
  }

}
