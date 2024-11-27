import React, { useState, useEffect } from 'react';

const SavedFilters = ({ currentFilters, onLoadFilter, className }) => {
  const [savedFilters, setSavedFilters] = useState([]);
  const [newFilterName, setNewFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  
    useEffect(() => {
      const filters = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      setSavedFilters(filters);
    }, []);
  
    const handleSaveFilter = () => {
      if (!newFilterName.trim()) return;
  
      const newFilter = {
        id: Date.now(),
        name: newFilterName,
        filters: currentFilters,
        savedAt: new Date().toISOString()
      };
  
      const updatedFilters = [...savedFilters, newFilter];
      localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
      setSavedFilters(updatedFilters);
      setNewFilterName('');
      setShowSaveDialog(false);
    };
  
    const handleDeleteFilter = (filterId) => {
      const updatedFilters = savedFilters.filter(filter => filter.id !== filterId);
      localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
      setSavedFilters(updatedFilters);
    };
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
  
    return (
      <div className={`card ${className || ''}`}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Saved Filters</h3>
          <button 
            className="btn btn-outline-primary"
            onClick={() => setShowSaveDialog(!showSaveDialog)}
          >
            Save Current Filters
          </button>
        </div>
        <div className="card-body">
          {showSaveDialog && (
            <div className="mb-4 d-flex gap-2">
              <input
                type="text"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                placeholder="Enter a name for this filter set"
                className="form-control"
              />
              <button 
                className="btn btn-primary"
                onClick={handleSaveFilter}
              >
                Save
              </button>
            </div>
          )}
  
          {savedFilters.length > 0 ? (
            <div className="d-flex flex-column gap-2">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="d-flex justify-content-between align-items-center p-2 border rounded"
                >
                  <div>
                    <h4 className="h6 mb-1">{filter.name}</h4>
                    <small className="text-muted">
                      Saved on {formatDate(filter.savedAt)}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => onLoadFilter(filter.filters)}
                    >
                      Load
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteFilter(filter.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-4">No saved filters yet</p>
          )}
        </div>
      </div>
    );
  };
  
  export default SavedFilters;