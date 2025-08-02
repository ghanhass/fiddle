import { CommonModule } from '@angular/common';
import { Component, OnInit,EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [FormsModule, CommonModule]
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
