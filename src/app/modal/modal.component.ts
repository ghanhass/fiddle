import { Component, OnInit,HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }

  private isVisible: boolean = false;

  @HostListener("window:keyup",["$event"])
  onComponentKeyup(event){
    //console.log("keyup event = ", event);
    if(event.key == "Escape"){
      this.hide();
    }
  }

  show(){
    this.isVisible = true;
  }

  hide(){
    this.isVisible = false;
  }

  isShown(){
    return this.isVisible;
  }

  ngOnInit(): void {
  }

}
