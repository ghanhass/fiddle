import { Component, OnInit,EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }

  private isVisible: boolean = false;
  @Output()onHide: EventEmitter<any> = new EventEmitter();

  show(){
    this.isVisible = true;
  }

  hide(){
    this.isVisible = false;
    this.onHide.emit();
  }

  isShown(){
    return this.isVisible;
  }

  ngOnInit(): void {
  }

}
