import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { AppRouterModule } from './app-router.module';
import { SalesModule } from './sales/sales.module';
import { SharedModule } from './shared/shared.module';

import esCO from '@angular/common/locales/es-CO'
import { registerLocaleData } from '@angular/common'
registerLocaleData(esCO)

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRouterModule,
        BrowserAnimationsModule,
        SalesModule,
        SharedModule
    ],
    providers: [{
        provide: LOCALE_ID, useValue: 'es-CO'
    }],
    bootstrap: [AppComponent]
})
export class AppModule { }
