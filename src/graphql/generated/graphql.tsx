import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Component = {
  __typename?: 'Component';
  childrens?: Maybe<Array<Maybe<Component>>>;
  dependencies?: Maybe<Array<Maybe<Dependencies>>>;
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  path: Scalars['String'];
  properties?: Maybe<Array<Maybe<Property>>>;
};

export type Dependencies = {
  __typename?: 'Dependencies';
  lib?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  scoped?: Maybe<Scalars['Boolean']>;
};

export type Property = {
  __typename?: 'Property';
  default: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  component?: Maybe<Component>;
  components: Array<Maybe<Component>>;
};


export type QueryComponentArgs = {
  path: Scalars['String'];
};


export type QueryComponentsArgs = {
  scope: Scalars['String'];
};
