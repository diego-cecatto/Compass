import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import resolvers from './src/graphql/resolvers/component.resolver';
import * as dotenv from 'dotenv';
dotenv.config();

const startServer = async () => {
    const typeDefs = `
    type Query {
        components(scope: String!): [Component]!,
        component(path: String!):Component
        documentation(path:String):String
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
        properties:[PropertyItems]
    }

    type PropertyItems {
        name: String!
        description: String
        type: String!
        default: String!
    }
    `;

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    //express server
    const app = express();
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.get('/rest', (req: any, res: any) => {
        res.json({
            data: 'API is working...',
        });
    });

    app.listen(process.env.PORT, () => {
        console.log(
            `🚀 Server is running at http://localhost:${process.env.PORT}`
        );
    });
};

startServer();
