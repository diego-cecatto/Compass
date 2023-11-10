import express from 'express';
import resolvers from '../../graphql/resolvers/component.resolver';
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
//@ts-ignore
import { Config } from '../../utils/config';
dotenv.config();
export class CompassServer {
    //todo generate cache

    async start() {
        const app = express();
        const httpServer = http.createServer(app);

        const typeDefs = fs.readFileSync(
            path.resolve(
                path.dirname(__filename),
                './../../graphql/typedefs/index.graphql'
            ),
            'utf-8'
        );
        const server = new ApolloServer<any>({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();
        app.use(express.static(path.join(process.cwd(), 'build')));

        app.use(
            '/graphql',
            cors<cors.CorsRequest>(),
            express.json(),

            // an Apollo Server instance and optional configuration options
            expressMiddleware(server, {
                context: async ({ req }) => ({ token: req.headers.token }),
            })
        );
        app.get('*', (req, res) => {
            res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
        });
        const CONFIG = await Config.read();
        await new Promise<void>((resolve) =>
            httpServer.listen({ port: CONFIG.port }, resolve)
        );
        console.log(`🚀 Server is running at http://localhost:${CONFIG.port}`);
    }
}
