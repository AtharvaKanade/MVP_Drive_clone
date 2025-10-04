import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { filesAPI } from '../services/api';
import FileUpload from './files/FileUpload';
import FileList from './files/FileList';
import SearchBar from './files/SearchBar';

function Dashboard() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showTrash, setShowTrash] = useState(false);

  const loadFiles = async (search = '', pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await filesAPI.getAll({
        search,
        page: pageNumber,
        limit: 20,
        trash: showTrash.toString()
      });

      setFiles(response.data.files);
      setPagination(response.data.pagination);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error loading files:', error);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [showTrash]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    loadFiles(term, 1);
  };

  const handleFileUploaded = () => {
    loadFiles(searchTerm, page);
  };

  const handleFileDeleted = () => {
    loadFiles(searchTerm, page);
  };

  const handlePageChange = (newPage) => {
    loadFiles(searchTerm, newPage);
  };

  const toggleTrashView = () => {
    setShowTrash(!showTrash);
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          margin: '0 0 1rem 0',
          color: '#1e293b'
        }}>
          Welcome back, {user.username}!
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>
            {showTrash ? 'Manage your deleted files' : 'Manage your files with Drive MVP'}
          </p>
          <button
            onClick={toggleTrashView}
            className={`btn ${showTrash ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1rem' }}
          >
            {showTrash ? 'View Active Files' : 'View Trash'}
          </button>
        </div>
      </div>

      {!showTrash && (
        <div style={{ marginBottom: '2rem' }}>
          <FileUpload onUpload={handleFileUploaded} />
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <button className="spinner"></button>
        </div>
      ) : (
        <FileList 
          files={files}
          onFileDeleted={handleFileDeleted}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Dashboard;
