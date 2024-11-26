import React, { useState, useEffect } from 'react';

const SaveGrantButton = ({ grant }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedGrants = JSON.parse(localStorage.getItem('savedGrants') || '[]');
    setIsSaved(savedGrants.some(saved => saved.id === grant?.id));
  }, [grant?.id]);

  const toggleSave = () => {
    const savedGrants = JSON.parse(localStorage.getItem('savedGrants') || '[]');
    
    if (isSaved) {
      const updatedGrants = savedGrants.filter(saved => saved.id !== grant.id);
      localStorage.setItem('savedGrants', JSON.stringify(updatedGrants));
      setIsSaved(false);
    } else {
      savedGrants.push({
        id: grant.id,
        funder_name: grant.funder_name || grant.title || 'Untitled Grant',
        description: grant.description || 'No description available',
        savedAt: new Date().toISOString()
      });
      localStorage.setItem('savedGrants', JSON.stringify(savedGrants));
      setIsSaved(true);
    }
  };

  if (!grant?.id) return null;

  return (
    <button
      onClick={toggleSave}
      className="btn btn-outline-secondary btn-sm"
    >
      {isSaved ? 'Saved' : 'Save Grant'}
    </button>
  );
};

export default SaveGrantButton;