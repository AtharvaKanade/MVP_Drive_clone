import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { filesAPI } from '../../services/api';
import { Upload, AlertCircle } from 'lucide-react';

function FileUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Check file size (configurable limit, default 100MB)
    const maxSize = 100 * 1024 * 1024; // Can be made configurable via API
    if (file.size > maxSize) {
      setError('File size must be less than 100MB');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      await filesAPI.upload(file);
      setMessage(`"${file.name}" uploaded successfully!`);
      onUpload();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      '*/*': [] // Accept all file types
    },
    multiple: false
  });

  return (
    <div className="card">
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1e293b' }}>
          Upload Files
        </h3>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
          Drag and drop files here, or click to select files. Maximum file size: 100MB
        </p>
      </div>

      <div 
        {...getRootProps()} 
        style={{
          border: isDragActive ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? '#f8fafc' : '#f9fafb',
          transition: 'all 0.2s',
          opacity: uploading ? 0.6 : 1
        }}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        {uploading ? (
          <div>
            <button className="spinner" style={{ width: '2rem', height: '2rem' }}></button>
            <p style={{ margin: '1rem 0 0 0', color: '#6b7280' }}>
              Uploading...
            </p>
          </div>
        ) : (
          <div>
            <Upload 
              size={48} 
              style={{ 
                color: '#6b7280',
                marginBottom: '1rem'
              }} 
            />
            {isDragActive ? (
              <p style={{ margin: 0, color: '#3b82f6', fontWeight: '500' }}>
                Drop the file here...
              </p>
            ) : (
              <div>
                <p style={{ 
                  margin: '0.5rem 0', 
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  Drag & drop files here
                </p>
                <p style={{ 
                  margin: '0', 
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  or <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                    click to browse
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {message && (
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '0.5rem',
          color: '#059669',
          fontSize: '0.875rem'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          color: '#ef4444',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
