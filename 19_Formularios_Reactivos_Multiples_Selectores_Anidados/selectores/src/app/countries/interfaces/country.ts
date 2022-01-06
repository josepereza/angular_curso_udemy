export interface Country {
    name: Name;
    cca2: string;
    borders?: string[];
}

export interface Name {
    common: string;
    official: string;
    nativeName: NativeName;
}

export interface NativeName {
    fra?: Translation;
    spa?: Translation;
}

export interface Translation {
    official: string;
    common:   string;
}
