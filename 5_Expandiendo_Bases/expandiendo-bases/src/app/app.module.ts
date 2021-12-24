import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeroesMarvelModule } from './heroes-marvel/heroes-marvel.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HeroesMarvelModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
