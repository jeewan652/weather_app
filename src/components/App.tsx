// src/components/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CitiesTable from './CitiesTable';
import WeatherPage from './WeatherPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CitiesTable />} />
                <Route path="/weather/:cityName" element={<WeatherPage />} />
            </Routes>
        </Router>
    );
};

export default App;