import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SavedGrants = () => {
  const [savedGrants, setSavedGrants] = useState([]);

  useEffect(() => {
    const grants = localStorage.getItem('savedGrants');
    if (grants) {
      // Sort grants by saved date, most recent first
      const parsedGrants = JSON.parse(grants);
      const sortedGrants = parsedGrants.sort((a, b) => 
        new Date(b.savedAt) - new Date(a.savedAt)
      );
      setSavedGrants(sortedGrants);
    }
  }, []);

  const handleRemove = (grantId) => {
    const grants = JSON.parse(localStorage.getItem('savedGrants') || '[]');
    const updatedGrants = grants.filter(grant => grant.id !== grantId);
    localStorage.setItem('savedGrants', JSON.stringify(updatedGrants));
    setSavedGrants(updatedGrants);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (savedGrants.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center p-5 bg-light rounded">
          <h2 className="mb-4">Your Saved Grants</h2>
          <p className="text-muted mb-4">You haven't saved any grants yet.</p>
          <Link 
            to="/" 
            className="btn btn-primary"
          >
            Browse Available Grants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Saved Grants ({savedGrants.length})</h2>
        <Link to="/" className="btn btn-outline-primary">
          Browse More Grants
        </Link>
      </div>

      <div className="row">
        {savedGrants.map((grant) => (
          <div key={grant.id} className="col-12 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Link 
                      to={`/grants/${grant.source}/${grant.id}`}
                      className="h5 text-primary mb-2 d-block text-decoration-none"
                    >
                      {grant.funder_name}
                    </Link>
                    <p className="text-muted small mb-2">
                      Saved on {formatDate(grant.savedAt)}
                    </p>
                    <p className="mb-0">
                      {grant.description && grant.description.length > 200
                        ? `${grant.description.slice(0, 200)}...`
                        : grant.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(grant.id)}
                    className="btn btn-outline-danger btn-sm ms-3"
                    title="Remove from saved grants"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedGrants;