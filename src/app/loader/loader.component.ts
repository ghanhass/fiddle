import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  private show: boolean = false;
  
  @Input() global: boolean = false;

  @Input() subGlobal: boolean = false;

  @Input() width: string;
  @Input() height: string;

  @Input() thickness: number;

  showLoader(){
    this.show = true;
  }

  getWrapperInlineStyle(){
    let obj: any = {}

    return obj;
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
