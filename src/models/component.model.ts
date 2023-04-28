export interface Component {
    name: string;
    path: string;
    childs?: Component[];
    dependencies?: Dependencies[];
    description?: string;
    props?: Prop[];
}

export interface Dependencies {
    name: string;
    scoped: boolean;
    lib: boolean;
}

export interface Prop {
    name: string;
    description?: string;
    type: string;
}
