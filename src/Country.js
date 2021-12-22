import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import './App.css';

const COUNTRY = gql`
  query Country($code: ID!) {
    country(code: $code) {
      name
      emoji
      code
      nameAndEmoji @client
    }
  }
`;

function Country() {
  const [code, setCode] = useState('');
  const history = useHistory();
  const { data, loading, error } = useQuery(COUNTRY, {
    variables: {
      code,
    },
    skip: code.length !== 2,
  });

  if (error) return <p>Whoops, something went wrong</p>;

  if (loading) return <p>Loading...</p>;

  return (
    <div className='App'>
      <button onClick={() => history.goBack()}>Go back</button>

      {data ? <p>{data.country.nameAndEmoji}</p> : <p>Pick a country!</p>}

      <label>Code: </label>
      <input
        id='enter-code'
        type='text'
        placeholder='Enter country code'
        onChange={(e) => setCode(e.target.value.toUpperCase())}
      />
    </div>
  );
}

export default Country;
