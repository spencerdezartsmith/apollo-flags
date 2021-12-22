import { ApolloClient, InMemoryCache } from '@apollo/client';
import { filterLetter } from './index';

let client;

export const getApolloClient = () => {
  if (client) return client;

  client = new ApolloClient({
    uri: 'https://countries.trevorblades.com/',
    cache: new InMemoryCache({
      // These are a replacement for local resolvers
      typePolicies: {
        Query: {
          fields: {
            // Intercept the country field so that we can either fetch from cache or go out to the server
            country: {
              keyFields: ['code'],
              read(existing, { toReference, args }) {
                // toReference replaces the old cache redirect api. its a fn that takes a typename and keyfield
                // and returns a reference object
                const countryRef = toReference({
                  __typename: 'Country',
                  code: args.code,
                });

                // existing being a previous query to the selected code
                // toReference is a way to connect our query with the result of another query
                return existing ?? countryRef;
              },
            },
            // Read shorthand
            filteredCountries: (_, { readField }) => {
              const letter = filterLetter();
              const countries = readField('countries') || [];

              if (!letter) return countries;
              // c is a reference object
              return countries.filter((c) => {
                // You can pass a reference obj as second argument
                const name = readField('name', c);
                return name.startsWith(letter);
              });
            },
          },
        },
        Country: {
          keyFields: ['code'],
          fields: {
            nameAndEmoji: {
              read(_, { readField }) {
                const name = readField('name');
                const emoji = readField('emoji');

                return `${name} ${emoji}`;
              },
            },
          },
        },
      },
    }),
  });

  return client;
};

// example mutation
// const [mutate, loading] = useMutation(ADD_SOMETHING,  {
//   // update gets direct access to the cache api's
//   update(cache, { data }) {
//     // always return the same fields as you query for
//     const newResponse = data?.something;
//     const existing = cache.readQuery({
//       query: OTHER_QUERY,
//     });

//     cache.writeQuery({
//       query: OTHER_QUERY,
//       data: {
//         stuff: [
//           ...existing,
//           newResponse
//         ]
//       }
//     })
//   }
// })
