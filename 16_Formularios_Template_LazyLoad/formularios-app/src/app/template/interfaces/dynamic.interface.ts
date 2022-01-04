export interface Person {
    name: string;
    favorites: Favorites[];
}


export interface Favorites {
    id: number;
    name: string;
}