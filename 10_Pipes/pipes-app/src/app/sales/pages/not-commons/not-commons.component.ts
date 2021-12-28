import { Component } from '@angular/core';
import { interval } from 'rxjs';

@Component({
    selector: 'app-not-commons',
    templateUrl: './not-commons.component.html',
    styles: [
    ]
})
export class NotCommonsComponent {
    public name: string = 'David Ferrer'
    public genre: string = 'male'
    public inviteMap =  {
        'male': 'invitarlo',
        'female': 'invitarla'
    }

    public clients: string[] = ['David', 'Juana', 'Ferrer', 'Valentina']
    public clientsMap =  {
        '=0': 'no tenemos ningún cliente esperando',
        '=1': 'tenemos un cliente esperando',
        'other': 'tenemos # clientes esperando'
    }

    public person = {
        name: 'David',
        edad: 20,
        address: 'Colombia'
    }

    public jsonObject = {
        array: this.clients,
        string: this.name,
        object1: this.inviteMap,
        object2: this.clientsMap,
        object3: this.person,
        boolean: true
    }

    public myObservable = interval(1000)

    public valuePromise = new Promise((resolve) => {
        setTimeout(() => {
            resolve('Tenemos data de promesa')
        }, 2500)
    })

    changeName = () => {
        this.name = 'Valentina'
        this.genre = 'female'
    }  

    deleteClient = () => this.clients.pop()
}
