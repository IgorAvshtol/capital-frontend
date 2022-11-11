import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { getStrapiUrl } from './api'


export const withApollo = () => {
    return new ApolloClient({
        ssrMode: true,
        link: createHttpLink({
            uri: getStrapiUrl('/graphql'),
            credentials: 'same-origin'
        }),
        cache: new InMemoryCache()
    })
}


export default function WithGraphQL({ children }) {
    const client = new ApolloClient({
        uri: getStrapiUrl('/graphql'),
        cache: new InMemoryCache(),
    })
    return <ApolloProvider client={client}>{children}</ApolloProvider>
}