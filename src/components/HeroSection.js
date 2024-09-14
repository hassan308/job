import React, { useState } from 'react';
import './HeroSection.css';
import JobTable from './JobTable';

const HeroSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const results = await onSearch(searchTerm);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hero-section">
      <div className="background-layers">
        <div className="layer layer-1"></div>
        <div className="layer layer-2"></div>
        <div className="layer layer-3"></div>
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Hitta ditt drömjobb</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Sök jobb..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Sök
          </button>
        </div>
        <button className="explore-button">Utforska</button>
      </div>
      <JobTable jobs={searchResults} isLoading={isLoading} />
    </div>
  );
}

export default HeroSection;
