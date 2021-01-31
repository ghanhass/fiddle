import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }

  private isVisible: boolean = false;

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
