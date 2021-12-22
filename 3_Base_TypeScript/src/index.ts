interface Passenger {
    name: string
    children?: string[]
}

const passenger1: Passenger = {
    name: 'Ferrer'
}

const passenger2: Passenger = {
    name: 'Ferrer',
    children: ['Hijo 1', 'Hijo 2']
}


const printChildren = (passanger: Passenger): void => {
    const howChildren = passanger.children?.length || 0
    console.log(howChildren)
}


printChildren(passenger2)
printChildren(passenger1)