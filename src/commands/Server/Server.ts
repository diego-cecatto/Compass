import express from 'express';
import resolvers from '../../graphql/resolvers/Component.resolver';
import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';

import path from 'path';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { createHandler } from 'graphql-http/lib/use/express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
//@ts-ignore
import { gql } from '@apollo/client';
import { Config } from '../../utils/Config';
dotenv.config();
export class Server {
    //todo generate cache

    async start() {
        const typeDefs = gql`
            scalar JSON

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
                props: JSON
            }

            type Dictionary {
                key: String
                value: Int
            }

            fragment ComponentFields on Component {
                name
                path
                description
                dependecies
                props
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
        const app = express();
        const httpServer = http.createServer(app);

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();
        app.use(express.static(path.join(process.cwd(), 'build')));
        app.use(
            '/',
            cors<cors.CorsRequest>(),
            express.json(),
            // an Apollo Server instance and optional configuration options
            expressMiddleware(server, {
                context: async ({ req }) => ({ token: req.headers.token }),
            })
        );
        const CONFIG = await Config.read();
        await new Promise<void>((resolve) =>
            httpServer.listen({ port: CONFIG.port }, resolve)
        );
        console.log(`🚀 Server is running at http://localhost:${CONFIG.port}`);
    }
}
