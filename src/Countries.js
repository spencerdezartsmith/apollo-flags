import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { filterLetter } from '.';
// import { filterLetter } from './index';

const COUNTRIES = gql`
  query Countries {
    filteredCountries @client {
      nameAndEmoji
      code
    }
    countries {
      name
      emoji
      code
      nameAndEmoji @client
    }
  }
`;

function Countries() {
  const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const { data, loading, error } = useQuery(COUNTRIES);

  if (error) return <p>Whoops, something went wrong</p>;

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        {alphabet.map((x) => (
          <span
            key={x}
            style={{ margin: '0 5px', cursor: 'pointer' }}
            onClick={() => {
              filterLetter(x);
            }}
          >
            {x}
          </span>
        ))}
        <ul>
          {data.filteredCountries.map((c) => (
            <li style={{ listStyleType: 'none' }} key={c.code}>
              {c.nameAndEmoji}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Countries;
