import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div style={{ position: 'relative' }}>
        <Search 
          size={20} 
          style={{ 
            position: 'absolute', 
            left: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6b7280'
          }} 
        />
        <input
          type="text"
          className="input"
          style={{ paddingLeft: '3rem' }}
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search files..."
        />
      </div>
    </form>
  );
}

export default SearchBar;
