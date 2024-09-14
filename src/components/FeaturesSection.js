import React from 'react';
import './FeaturesSection.css';

function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Vår innovativa approach</h2>
        <div className="features-grid">
          <div className="feature-item">
            <i className="fas fa-robot feature-icon"></i>
            <h3>AI-driven karriärmatchning</h3>
            <p>Vår avancerade AI analyserar din profil och matchar dig med de mest relevanta karriärmöjligheterna.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-chart-line feature-icon"></i>
            <h3>Personlig karriärutveckling</h3>
            <p>Få en skräddarsydd plan för att accelerera din professionella tillväxt och nå dina karriärmål.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-network-wired feature-icon"></i>
            <h3>Exklusivt branschnätverk</h3>
            <p>Få tillgång till ett nätverk av ledande företag och branschexperter för unika karriärmöjligheter.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
