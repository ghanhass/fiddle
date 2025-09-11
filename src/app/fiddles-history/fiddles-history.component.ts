import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from '../main.service';
import { Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { FiddleData } from '../models/fiddle-data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { map, Observable, Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-fiddles-history',
  templateUrl: './fiddles-history.component.html',
  styleUrls: ['./fiddles-history.component.css'],
  imports: [LoaderComponent, FormsModule, CommonModule, RouterModule],
})
export class FiddlesHistoryComponent implements OnInit {
  isLoading: boolean = false;
  searchText: string = '';
  fiddlesListSize: number = 0;
  fiddlesList$: Subject<Array<any>> = new Subject();
  pageNumber: number = 1;
  canChangePage: boolean = true;
  @ViewChild('historyLoader') historyLoader: LoaderComponent =
    new LoaderComponent();

  constructor(private mainService: MainService, private router: Router) {
    this.fiddlesList$.next([]);
  }

  goToFiddle(fiddle: any) {
    if (this.canChangePage) {
      let id = fiddle.id;
      if (id) {
        this.router.navigate(['/' + id]);
      }
    }
    console.log('goToFiddle fiddle = ', fiddle);
  }

  ngOnInit() {
    this.generateFiddlesList();
  }

  nextPage() {
    if (this.fiddlesListSize > 0) {
      this.pageNumber++;
      this.generateFiddlesList();
    }
  }

  generateFiddlesList() {
    this.historyLoader.showLoader();
    this.isLoading = true;
    this.mainService.getFiddlesList(this.pageNumber).subscribe({
      next: (res) => {
        console.log('getFiddlesList res = ', res);
        this.fiddlesList$.next(this.generateFilteredFiddlesList(this.mainService.envVars.production? res : res.data));

        this.historyLoader.hideLoader();
        this.isLoading = false;
        this.canChangePage = true;
      },
    });
  }

  prevPage() {
    if (this.fiddlesListSize > 1) {
      this.pageNumber--;
      this.generateFiddlesList();
    }
  }

  generateFilteredFiddlesList(res: Array<any>): Array<any> {
    let totalElements = res.filter((el) => {
      let arr = new Date(el.createdAt).toDateString().split(' ');
      arr.splice(0, 1);
      arr[1] += ',';
      let str = arr.join(' ');

      if (this.searchText) {
        return (
          (el.title as string)
            .toUpperCase()
            .includes(this.searchText.toUpperCase()) ||
          str.toUpperCase().includes(this.searchText.toUpperCase())
        );
      }

      return el;
    });

    this.fiddlesListSize = totalElements.length;

    return totalElements;
  }

  getLoaderStyle() {
    let obj: any = {};

    return obj;
  }

  getFiddleType(fiddle: FiddleData | any) {
    let str;
    let appMode;
    if (this.mainService.envVars.production) {
      str =
        fiddle.file_name.indexOf('_') > -1
          ? fiddle.file_name.split('_')[0]
          : 'fiddle';
    } else {
      str = fiddle.appMode || 'fiddle';
    }
    return str;
  }
}
