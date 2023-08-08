import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Component = {
  __typename?: 'Component';
  childrens?: Maybe<Array<Maybe<Component>>>;
  dependencies?: Maybe<Array<Maybe<Dependencies>>>;
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  properties?: Maybe<Array<Maybe<Property>>>;
};

export type Dependencies = {
  __typename?: 'Dependencies';
  lib?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  scoped?: Maybe<Scalars['Boolean']['output']>;
};

export type Property = {
  __typename?: 'Property';
  default: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
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
