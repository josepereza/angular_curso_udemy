import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroesRoutingModule } from './routes/heroes-routing.module';

import { AddComponent } from './pages/add/add.component';
import { SearchComponent } from './pages/search/search.component';
import { HeroComponent } from './pages/hero/hero.component';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';



@NgModule({
    declarations: [
        AddComponent,
        SearchComponent,
        HeroComponent,
        HomeComponent,
        ListComponent
    ],
    imports: [
        CommonModule,
        HeroesRoutingModule
    ]
})
export class HeroesModule { }
