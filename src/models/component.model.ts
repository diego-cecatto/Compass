//@ts-ignore
import { Documentation } from 'react-docgen';

export declare type Component = {
    path: string;
    basePath: string;
    docPath: string;
    fullPath: string;
    name: string;
    childs?: Component[];
    dependencies?: Dependencies[];
} & Pick<Documentation, 'props' | 'description'>;

export interface Dependencies {
    name: string;
    scoped: boolean;
    lib: boolean;
}
