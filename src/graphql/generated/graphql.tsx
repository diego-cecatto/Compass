//@ts-ignore
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends ' $fragmentName' | '__typename'
              ? T[P]
              : never;
      };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    JSON: { input: any; output: any };
};

export type Component = {
    __typename?: 'Component';
    childs?: Maybe<Array<Maybe<Component>>>;
    dependencies?: Maybe<Array<Maybe<Dependencies>>>;
    description?: Maybe<Scalars['String']['output']>;
    fullPath: Scalars['String']['output'];
    name: Scalars['String']['output'];
    path: Scalars['String']['output'];
    props?: Maybe<Scalars['JSON']['output']>;
};

export type DefaultValueDescriptor = {
    __typename?: 'DefaultValueDescriptor';
    computed?: Maybe<Scalars['Boolean']['output']>;
    value?: Maybe<Scalars['String']['output']>;
};

export type Dependencies = {
    __typename?: 'Dependencies';
    lib?: Maybe<Scalars['Boolean']['output']>;
    name: Scalars['String']['output'];
    scoped?: Maybe<Scalars['Boolean']['output']>;
};

export type Dictionary = {
    __typename?: 'Dictionary';
    key?: Maybe<Scalars['String']['output']>;
    value?: Maybe<Scalars['String']['output']>;
};

export type Property = {
    __typename?: 'Property';
    defaultValue?: Maybe<DefaultValueDescriptor>;
    description?: Maybe<Scalars['String']['output']>;
    flowType?: Maybe<Scalars['String']['output']>;
    name?: Maybe<Scalars['String']['output']>;
    required?: Maybe<Scalars['Boolean']['output']>;
    tsType?: Maybe<Scalars['String']['output']>;
    type?: Maybe<Scalars['String']['output']>;
};

export type Query = {
    __typename?: 'Query';
    component?: Maybe<Component>;
    components: Array<Maybe<Component>>;
};

export type QueryComponentArgs = {
    path: Scalars['String']['input'];
};

export type QueryComponentsArgs = {
    scope: Scalars['String']['input'];
};
