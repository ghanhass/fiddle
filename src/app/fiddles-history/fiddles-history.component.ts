import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoaderComponent } from '../loader/loader.component';
import { FiddleData } from '../fiddle-data';
import { GistFiddle } from '../gist-fiddle';

@Component({
  selector: 'app-fiddles-history',
  templateUrl: './fiddles-history.component.html',
  styleUrls: ['./fiddles-history.component.css']
})
export class FiddlesHistoryComponent implements OnInit {
  searchText: string = "";
  fiddlesList: any[] = [];
  pageNumber: number = 1;
  canChangePage: boolean = true;
  @ViewChild("historyLoader")historyLoader: LoaderComponent;

  constructor(private mainService: MainService, private router: Router){
  }

  getFiddlesList(){
    this.canChangePage = false;
    this.historyLoader.showLoader();
    this.historyLoader.subGlobal = true;
    this.mainService.getFiddlesList(this.pageNumber).subscribe({
      next: (res)=>{
        console.log("getFiddlesList res = ", res);
        this.fiddlesList = res;

        this.historyLoader.hideLoader();
        this.canChangePage = true;
      }
    })
  }

  goToFiddle(fiddle){
    if(this.canChangePage){
      let id = fiddle.id;
      if(id){
        this.router.navigate(["/"+id]);
      }
    }
    console.log("goToFiddle fiddle = ", fiddle);
  }

  ngOnInit(){
  }

  nextPage(){
    if(this.fiddlesList.length){
      this.pageNumber++;
      this.getFiddlesList();
    }
  }

  prevPage(){
    if(this.pageNumber > 1){
      this.pageNumber--;
      this.getFiddlesList();
    }
  }

  generateFiddlesList(){
    
    return this.fiddlesList.filter((el)=>{
      let arr = (new Date(el.created_at)).toDateString().split(" ");
      arr.splice(0, 1);
      arr[1]+=","
      let str = arr.join(" ");

      if(this.searchText){
        return (el.title as string).toUpperCase().includes(this.searchText.toUpperCase()) || str.toUpperCase().includes(this.searchText.toUpperCase());
      }

      return el;
    });
  }

  getLoaderStyle(){
    let obj : any = {
    }

    return obj;
  }

  getFiddleType(fiddle:FiddleData | any){
    let str;
    let appMode;
    if(location.origin == "https://ghanhass.github.io"){
      str = fiddle.file_name.indexOf("_") > -1 ? fiddle.file_name.split("_")[0] : 'fiddle';
    }
    else{
      str = fiddle.appmode || 'fiddle';
    }
    return str;
  }
}
