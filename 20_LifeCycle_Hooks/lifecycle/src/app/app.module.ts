import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Page1Component } from './pages/page1/page1.component';
import { ShowNameComponent } from './pages/show-name/show-name.component';

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    ShowNameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
