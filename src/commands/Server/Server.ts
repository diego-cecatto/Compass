import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import resolvers from '../../graphql/resolvers/component.resolver';
import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';
// import ApolloServerPluginResponseCache from 'apollo-server-plugin-response-cache';
// import { ApolloServerPluginCacheControl } from 'apollo-server-core';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { gql } from 'apollo-server-core';

import Keyv from 'keyv';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
export class Server {
    //todo generate cache

    async start() {
        const typeDefs = gql`
            type Query {
                components(scope: String): [Component]!
                component(path: String!): Component
                documentation(path: String): String
            }

            type Component {
                name: String!
                path: String!
                description: String
                childrens: [Component]
                dependencies: [Dependencies]
                prop: Property
            }

            fragment ComponentFields on Component {
                name
                path
                description
                dependecies
                prop
            }

            fragment ComponentRecursive on Component {
                childrens {
                    ...ComponentFields
                    childrens {
                        ...ComponentFields
                        childrens {
                            ...ComponentFields
                        }
                    }
                }
            }

            type Dependencies {
                name: String!
                scoped: Boolean
                lib: Boolean
            }

            type Property {
                name: String!
                properties: [PropertyItems]
            }

            type PropertyItems {
                name: String!
                description: String
                type: String!
                default: String
            }
        `;

        // const cacheControl: any = new ApolloServerPluginCacheControl();

        // const responseCache: any = new ApolloServerPluginResponseCache();

        const apolloServer = new ApolloServer({
            typeDefs,
            resolvers,
            cache: new InMemoryLRUCache({
                maxSize: 10000, // Adjust the cache size as needed
            }),
        });

        //express server
        const app = express();
        await apolloServer.start();
        apolloServer.applyMiddleware({ app });

        app.use(express.static(path.join(process.cwd(), 'build')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
        });

        app.listen(process.env.PORT, () => {
            console.log(
                `🚀 Server is running at http://localhost:${process.env.PORT}`
            );
        });
    }
}
