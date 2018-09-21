import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StorageServiceModule } from 'angular-webstorage-service';

import { AppComponent } from './app.component';
import {StorageBrowser} from './services/storage';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StorageServiceModule,
    FontAwesomeModule
  ],
  providers: [StorageBrowser],
  bootstrap: [AppComponent]
})
export class AppModule { }
