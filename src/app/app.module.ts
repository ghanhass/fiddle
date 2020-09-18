import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HtmlPartComponent } from './html-part/html-part.component';
import { CssPartComponent } from './css-part/css-part.component';
import { JsPartComponent } from './js-part/js-part.component';
import { IframePartComponent } from './iframe-part/iframe-part.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HtmlPartComponent,
    CssPartComponent,
    JsPartComponent,
    IframePartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
