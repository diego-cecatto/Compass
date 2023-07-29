import { ApolloClient, InMemoryCache } from '@apollo/client';

//todo retrieve by using a .env file
export class BaseAction {
    static client() {
        return new ApolloClient({
            uri: 'http://localhost:5000/graphql',
            cache: new InMemoryCache(),
        });
    }
}
