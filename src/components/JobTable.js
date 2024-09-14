import React, { useState } from 'react';
import './JobTable.css';

const JobTable = ({ jobs, isLoading }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  const openModal = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleCreateCV = (job) => {
    // Här kan du lägga till logik för att skapa CV
    console.log('Skapa CV för jobb:', job.title);
  };

  if (isLoading) {
    return (
      <div className="job-table-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Söker jobb...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-table-container">
      {jobs.length > 0 ? (
        <table className="job-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Beskrivning</th>
              <th>Företag</th>
              <th>Plats</th>
              <th>Publicerad</th>
              <th>Sista ansökningsdag</th>
              <th>Skapa CV</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td className="description-cell">
                  <p>{job.description.slice(0, 50)}...</p>
                  <button className="view-more-btn" onClick={() => openModal(job)}>Läs mer</button>
                </td>
                <td>{job.company_name}</td>
                <td>{job.municipality}</td>
                <td>{new Date(job.published_date).toLocaleDateString()}</td>
                <td>{job.last_application_date ? new Date(job.last_application_date).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button className="create-cv-btn" onClick={() => handleCreateCV(job)}>Skapa CV</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p></p>
      )}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <h3>{selectedJob.company_name}</h3>
            <p><strong>Plats:</strong> {selectedJob.municipality}</p>
            <p><strong>Publicerad:</strong> {new Date(selectedJob.published_date).toLocaleDateString()}</p>
            <p><strong>Sista ansökningsdag:</strong> {selectedJob.last_application_date ? new Date(selectedJob.last_application_date).toLocaleDateString() : 'N/A'}</p>
            <h4>Beskrivning:</h4>
            <p>{selectedJob.description}</p>
            <button onClick={closeModal}>Stäng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTable;