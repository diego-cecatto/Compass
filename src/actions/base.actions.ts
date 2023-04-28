import { ApolloClient, InMemoryCache } from '@apollo/client';

//todo retrieve by using a .env file
export class BaseAction {
    static client() {
        return new ApolloClient({
            uri: 'https://localhost:4000',
            cache: new InMemoryCache(),
        });
    }
}
