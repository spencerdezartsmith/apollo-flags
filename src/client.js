import { ApolloClient, InMemoryCache } from '@apollo/client';
import { filterLetter } from './index';

let client;

export const getApolloClient = () => {
  if (client) return client;

  client = new ApolloClient({
    uri: 'https://countries.trevorblades.com/',
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            country: {
              keyFields: ['code'],
              read(existing, { toReference, args }) {
                const countryRef = toReference({
                  __typename: 'Country',
                  code: args.code,
                });

                return existing ?? countryRef;
              },
            },
            filteredCountries: (_, { readField }) => {
              const letter = filterLetter();
              const countries = readField('countries');

              if (!letter) return countries;

              return countries.filter((c) => {
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

  return clien
