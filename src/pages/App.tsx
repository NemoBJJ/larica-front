import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListaRestaurantes from '../components/ListaRestaurantes';
import Dashboard from '../components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListaRestaurantes />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
