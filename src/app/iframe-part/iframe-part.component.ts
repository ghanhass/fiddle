import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iframe-part',
  templateUrl: './iframe-part.component.html',
  styleUrls: ['./iframe-part.component.css']
})
export class IframePartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onFormLoad(): void {
    console.log("iframe angular load event");
  }

}