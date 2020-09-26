import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from "src/environments/environment" 

@Component({
  selector: 'app-iframe-part',
  templateUrl: './iframe-part.component.html',
  styleUrls: ['./iframe-part.component.css']
})
export class IframePartComponent implements OnInit {

  @Input()jsCode: string;
  @Input()htmlCode: string;
  @Input()cssCode: string;
  @ViewChild("form")form: ElementRef;
  url: string = environment.url;

  runCode(){
    this.form.nativeElement.submit();
  }

  constructor() { }

  ngOnInit(): void {
  }

  onFormLoad(): void {
    console.log("iframe angular load event");
  }

}