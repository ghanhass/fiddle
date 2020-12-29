import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HtmlPartComponent } from './html-part/html-part.component';
import { CssPartComponent } from './css-part/css-part.component';
import { JsPartComponent } from './js-part/js-part.component';
import { IframePartComponent } from './iframe-part/iframe-part.component';
import { FormsModule } from "@angular/forms";
/*import { MonacoEditorModule } from "ngx-monaco-editor";*/
import { CodeEditorModule } from "@ngstack/code-editor";
import { HttpClientModule } from "@angular/common/http";
import { LoaderComponent } from './loader/loader.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule} from "ngx-toastr";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HtmlPartComponent,
    CssPartComponent,
    JsPartComponent,
    IframePartComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CodeEditorModule.forRoot({
      baseUrl: 'assets/monaco-editor'
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
