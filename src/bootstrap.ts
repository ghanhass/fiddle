import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "environments/environment.prod";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

if(environment.production){
    enableProdMode();
}

bootstrapApplication(AppComponent,appConfig)