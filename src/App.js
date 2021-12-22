import React from 'react';
import { Link } from 'react-router-dom';
import Countries from './Countries.js';
import './App.css';

function App() {
  return (
    <>
      <h1>Pointless Country Code App</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to='/country'>Single Country</Link>
        <Countries />
      </div>
    </>
  );
}

export default App;
