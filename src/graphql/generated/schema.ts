import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type Component = {
  __typename?: 'Component';
  basePath: Scalars['String']['output'];
  childs?: Maybe<Array<Maybe<Component>>>;
  dependencies?: Maybe<Array<Maybe<Dependencies>>>;
  description?: Maybe<Scalars['String']['output']>;
  docPath?: Maybe<Scalars['String']['output']>;
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
  documentation?: Maybe<Scalars['String']['output']>;
};


export type QueryComponentArgs = {
  path: Scalars['String']['input'];
};


export type QueryComponentsArgs = {
  scope?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentationArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Component: ResolverTypeWrapper<Component>;
  DefaultValueDescriptor: ResolverTypeWrapper<DefaultValueDescriptor>;
  Dependencies: ResolverTypeWrapper<Dependencies>;
  Dictionary: ResolverTypeWrapper<Dictionary>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Property: ResolverTypeWrapper<Property>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Component: Component;
  DefaultValueDescriptor: DefaultValueDescriptor;
  Dependencies: Dependencies;
  Dictionary: Dictionary;
  JSON: Scalars['JSON']['output'];
  Property: Property;
  Query: {};
  String: Scalars['String']['output'];
};

export type ComponentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Component'] = ResolversParentTypes['Component']> = {
  basePath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  childs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Component']>>>, ParentType, ContextType>;
  dependencies?: Resolver<Maybe<Array<Maybe<ResolversTypes['Dependencies']>>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  docPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fullPath?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  props?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DefaultValueDescriptorResolvers<ContextType = any, ParentType extends ResolversParentTypes['DefaultValueDescriptor'] = ResolversParentTypes['DefaultValueDescriptor']> = {
  computed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DependenciesResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dependencies'] = ResolversParentTypes['Dependencies']> = {
  lib?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scoped?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DictionaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Dictionary'] = ResolversParentTypes['Dictionary']> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type PropertyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Property'] = ResolversParentTypes['Property']> = {
  defaultValue?: Resolver<Maybe<ResolversTypes['DefaultValueDescriptor']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flowType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  tsType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  component?: Resolver<Maybe<ResolversTypes['Component']>, ParentType, ContextType, RequireFields<QueryComponentArgs, 'path'>>;
  components?: Resolver<Array<Maybe<ResolversTypes['Component']>>, ParentType, ContextType, Partial<QueryComponentsArgs>>;
  documentation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryDocumentationArgs>>;
};

export type Resolvers<ContextType = any> = {
  Component?: ComponentResolvers<ContextType>;
  DefaultValueDescriptor?: DefaultValueDescriptorResolvers<ContextType>;
  Dependencies?: DependenciesResolvers<ContextType>;
  Dictionary?: DictionaryResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Property?: PropertyResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

