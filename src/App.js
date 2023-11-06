import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import List from './components/List';
import Home from './components/Home';
import Form from './components/Form';
import Contract from './components/Contract';
import Done from './components/Done';
import TodaysContracts from './components/TodaysContracts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/contract" element={<Contract />} />
        <Route path="/done" element={<Done />} />
        <Route path="/today" element={<TodaysContracts />} />
      </Routes>
    </Router>
  );
}

export default App;
