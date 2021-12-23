import { NgModule } from "@angular/core";
import { CounterModule } from "./counter/counter.module";
import { HeroesModules } from "./heroes/heroes.module";

@NgModule({
    imports: [
        CounterModule,
        HeroesModules
    ],
    exports: [
        CounterModule,
        HeroesModules
    ]
})
export class ComponentsModule {}