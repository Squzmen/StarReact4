// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BackgroundProvider } from './context/BackgroundContext';
import './App.css';
import Navigation from './components/Navigation';
import DynamicBackground from './components/DynamicBackground';
import BackgroundSelector from './components/BackgroundSelector';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Trash from './pages/Trash';
import DataManagement from './pages/DataManagement';

function App() {
  return (
    <BackgroundProvider>
      <Router>
        <div className="app-container">
          <DynamicBackground />
          <BackgroundSelector />
          <Navigation />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/technology/:id" element={<TechnologyDetail />} />
            <Route path="/add-technology" element={<AddTechnology />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/data-management" element={<DataManagement />} />
          </Routes>
        </div>
      </Router>
    </BackgroundProvider>
  );
}

export default App;
