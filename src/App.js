import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Assignment from './components/Assignments';

const App = () => {
    const [token, setToken] = useState('');

    const handleLogin = (newToken) => {
        setToken(newToken);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Auth onLogin={handleLogin} />} />
                    <Route path="/assignments" element={<Assignment token={token} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
