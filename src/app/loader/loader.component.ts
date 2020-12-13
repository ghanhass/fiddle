import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  private show: boolean = false;

  showLoader(){
    this.show = true;
  }

  isLoaderShow(): boolean{
    return this.show;
  }

  hideLoader(){
    this.show = false;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
