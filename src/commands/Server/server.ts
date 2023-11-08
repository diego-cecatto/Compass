import express from 'express';
// import resolvers from '../../graphql/resolvers/component.resolver';
import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import * as fs from 'fs';
import path from 'path';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import typeDefs from './../../graphql/typedefs/index.graphql';
//@ts-ignore
import { gql } from '@apollo/client';
import { Config } from '../../utils/config';
import { loadDocuments } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { Resolvers as resolvers } from '../../graphql/generated/schema';

dotenv.config();
export class CompassServer {
    //todo generate cache

    async start() {
        const app = express();
        const httpServer = http.createServer(app);
        // const typeDefs = await loadDocuments(
        //     './../../graphql/typedefs/index.graphql',
        //     {
        //         file,
        //         loaders: [new GraphQLFileLoader()],
        //     }
        // );
        console.log(typeDefs);
        const server = new ApolloServer({
            typeDefs: gql`
                ${typeDefs}
            `,
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
