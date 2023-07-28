export interface Component {
    name: string;
    path: string;
    childs?: Component[];
    dependencies?: Dependencies[];
    description?: string;
    props?: Property[];
}

export interface Dependencies {
    name: string;
    scoped: boolean;
    lib: boolean;
}

export interface Property {
    name: string;
    description?: string;
    type: string;
}
