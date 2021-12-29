import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'capitalLetter'
})
export class CapitalLetterPipe implements PipeTransform {
    transform(value: string, inUpperCase: boolean = true): string {
        return (inUpperCase) ? value.toUpperCase() : value.toLowerCase()
    }
}
