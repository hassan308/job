import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import jobData from './cleaned_detailed_job_ads_ekonom.json';
import './App.css';

function App() {
  const handleSearch = async (searchTerm) => {
    // Simulera en asynkron sökning
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Filtrera jobben baserat på söktermen
    return jobData.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Router>
      <div className="App">
        <HeroSection onSearch={handleSearch} />
        <FeaturesSection />
        <CtaSection />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
