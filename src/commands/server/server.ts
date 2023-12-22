import express from 'express';
import resolvers from '../../graphql/resolvers/component.resolver';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import * as fs from 'fs';
import compression from 'compression';
import path from 'path';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
//@ts-ignore
import { AppConfig, BuildParams } from '../../utils/config';
export class CompassServer {
    async start(conf: BuildParams = { env: 'PROD' }) {
        const app = express();
        const httpServer = http.createServer(app);

        const typeDefs = fs.readFileSync(
            path.resolve(
                path.dirname(__filename),
                './../../graphql/typedefs/index.graphql'
            ),
            'utf8'
        );
        const customProcessEnv = process.env;
        customProcessEnv.NODE_ENV = conf.env;
        const server = new ApolloServer<any>({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();
        app.use(express.static(path.join(process.cwd(), 'build')));
        app.use(compression());
        app.use(
            '/graphql',
            cors<cors.CorsRequest>(),
            express.json(),

            // an Apollo Server instance and optional configuration options
            expressMiddleware(server, {
                context: async ({ req }) => ({ token: req.headers.token }),
            })
        );
        app.use(
            express.static(__dirname, {
                extensions: ['html'],
                setHeaders: (res, path) => {
                    if (path.match(/(\.html|\/sw\.js)$/)) {
                        this.setNoCache(res);
                        return;
                    }

                    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json)$/)) {
                        this.setLongTermCache(res);
                    }
                },
            })
        );
        app.get('*', (req, res) => {
            res.sendFile(path.join(process.cwd(), 'build', 'index.html'));
        });

        const CONFIG = await AppConfig.read();
        await new Promise<void>((resolve) =>
            httpServer.listen({ port: CONFIG.port }, resolve)
        );
        console.log(`🚀 Server is running at http://localhost:${CONFIG.port}`);
    }

    setNoCache(res: express.Response<any, Record<string, any>>) {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1);
        res.setHeader('Expires', date.toUTCString());
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Cache-Control', 'public, no-cache');
    }

    setLongTermCache(res: express.Response<any, Record<string, any>>) {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        res.setHeader('Expires', date.toUTCString());
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
}
