import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HtmlPartComponent } from './html-part/html-part.component';
import { CssPartComponent } from './css-part/css-part.component';
import { JsPartComponent } from './js-part/js-part.component';
import { IframePartComponent } from './iframe-part/iframe-part.component';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { LoaderComponent } from './loader/loader.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule} from "ngx-toastr";
import { ModalComponent } from './modal/modal.component';
import { RessourcesComponent } from './ressources/ressources.component';
import { AngularSplitModule } from "angular-split";
import { MainService } from './main.service';
import { SafePipe } from './safe.pipe';

import 'brace';
import 'brace/mode/text';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/css';
import 'brace/theme/github';
import 'brace/theme/clouds';
import { FiddlesHistoryComponent } from './fiddles-history/fiddles-history.component';
import { PastebinComponent } from './pastebin/pastebin.component';
import { AceEditorModule } from 'ace-editor-ng';

export function loadConfigs(mainService: MainService){
  return ():Promise<any> => {
    return mainService.initConfig();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HtmlPartComponent,
    CssPartComponent,
    JsPartComponent,
    IframePartComponent,
    LoaderComponent,
    ModalComponent,
    RessourcesComponent,
    SafePipe,
    FiddlesHistoryComponent,
    PastebinComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularSplitModule,
    AceEditorModule,
    //AceModule
  ],
  providers: [{
    provide: APP_INITIALIZER, useFactory:loadConfigs, deps:[MainService], multi:true
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
