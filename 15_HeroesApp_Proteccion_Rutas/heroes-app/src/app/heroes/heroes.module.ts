import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { HeroesRoutingModule } from './routes/heroes-routing.module';
import { MaterialDesignModule } from '../material-design/material-design.module';

import { AddComponent } from './pages/add/add.component';
import { HeroComponent } from './pages/hero/hero.component';
import { HomeComponent } from './pages/home/home.component';
import { ListComponent } from './pages/list/list.component';
import { SearchComponent } from './pages/search/search.component';
import { HeroCardComponent } from './components/hero-card/hero-card.component';
import { ImageHeroPipe } from './pipes/image-hero.pipe';
import { ConfirmComponent } from './components/confirm/confirm.component';



@NgModule({
    declarations: [
        AddComponent,
        HeroComponent,
        HomeComponent,
        ListComponent,
        SearchComponent,
        HeroCardComponent,
        ImageHeroPipe,
        ConfirmComponent
    ],
    imports: [
        CommonModule,
        HeroesRoutingModule,
        FlexLayoutModule,
        FormsModule,
        MaterialDesignModule
    ]
})
export class HeroesModule { }
