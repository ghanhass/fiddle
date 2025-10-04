import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideAnimations } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { HttpClientXsrfModule, provideHttpClient, withXsrfConfiguration } from "@angular/common/http";
import { provideToastr } from "ngx-toastr";

const routes: Routes = [
  {
    path:":id", component: MainComponent
  },
  {
    path:"**", component: MainComponent
  }
];

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        importProvidersFrom(
            RouterModule.forRoot(routes,  {bindToComponentInputs: true})
        ),
        provideHttpClient(
          withXsrfConfiguration(
          {
            cookieName: "XSRF-TOKEN",
            headerName: "X-XSRF-TOKEN"
          }
        )),
        provideToastr()
    ],
    
}