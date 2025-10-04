import React, { useState } from 'react';
import { filesAPI } from '../../services/api';
import {
  Download,
  Trash2,
  RotateCcw,
  X,
  File,
  Image,
  Video,
  FileText,
  Music,
  Archive,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function FileIcon({ mimetype }) {
  const type = mimetype.split('/')[0];
  
  const iconMap = {
    image: <Image size={20} color="#059669" />,
    video: <Video size={20} color="#dc2626" />,
    audio: <Music size={20} color="#7c3aed" />,
    'application/pdf': <FileText size={20} color="#dc2626" />,
    'application/zip': <Archive size={20} color="#f59e0b" />,
    'application/x-rar-compressed': <Archive size={20} color="#f59e0b" />
  };

  return iconMap[mimetype] || iconMap[type] || <File size={20} color="#6b7280" />;
}

function FileRow({ file, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    try {
      await filesAPI.download(file.filename, file.originalName);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Download failed');
    }
  };

  const handleMoveToTrash = async () => {
    if (!window.confirm(`Move "${file.originalName}" to trash?`)) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await filesAPI.moveToTrash(file.filename);
      onDeleted();
    } catch (error) {
      console.error('Move to trash error:', error);
      setError('Failed to move file to trash');
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async () => {
    setDeleting(true);
    setError('');

    try {
      await filesAPI.restore(file.filename);
      onDeleted();
    } catch (error) {
      console.error('Restore error:', error);
      setError('Failed to restore file');
    } finally {
      setDeleting(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!window.confirm(`Permanently delete "${file.originalName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await filesAPI.permanentDelete(file.filename);
      onDeleted();
    } catch (error) {
      console.error('Permanent delete error:', error);
      setError('Failed to permanently delete file');
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr style={{ 
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s'
    }} onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}>
      <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <FileIcon mimetype={file.mimetype} />
        <div>
          <div style={{ fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>
            {file.originalName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {formatFileSize(file.size)}
          </div>
        </div>
      </td>
      
      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        {formatDate(file.uploadedAt)}
      </td>
      
      <td style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleDownload}
            className="btn btn-outline"
            style={{ padding: '0.5rem', minWidth: 'auto' }}
            title="Download"
          >
            <Download size={16} />
          </button>

          {file.deleted ? (
            // File is in trash - show restore and permanent delete options
            <>
              <button
                onClick={handleRestore}
                disabled={deleting}
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem',
                  minWidth: 'auto',
                  opacity: deleting ? 0.6 : 1
                }}
                title="Restore from trash"
              >
                {deleting ? (
                  <button className="spinner" style={{ width: '1rem', height: '1rem' }}></button>
                ) : (
                  <RotateCcw size={16} />
                )}
              </button>

              <button
                onClick={handlePermanentDelete}
                disabled={deleting}
                className="btn btn-danger"
                style={{
                  padding: '0.5rem',
                  minWidth: 'auto',
                  opacity: deleting ? 0.6 : 1
                }}
                title="Permanently delete"
              >
                {deleting ? (
                  <button className="spinner" style={{ width: '1rem', height: '1rem' }}></button>
                ) : (
                  <X size={16} />
                )}
              </button>
            </>
          ) : (
            // File is active - show move to trash option
            <button
              onClick={handleMoveToTrash}
              disabled={deleting}
              className="btn btn-danger"
              style={{
                padding: '0.5rem',
                minWidth: 'auto',
                opacity: deleting ? 0.6 : 1
              }}
              title="Move to trash"
            >
              {deleting ? (
                <button className="spinner" style={{ width: '1rem', height: '1rem' }}></button>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
      </td>

      {error && (
        <td colSpan="3" style={{ padding: '0 1rem' }}>
          <div style={{ 
            color: '#ef4444', 
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '0.5rem'
          }}>
            <AlertCircle size={12} />
            {error}
          </div>
        </td>
      )}
    </tr>
  );
}

function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '2rem',
      padding: '1rem 0'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalFiles)} of {pagination.totalFiles} files
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="btn btn-outline"
          style={{ padding: '0.5rem 0.75rem' }}
        >
          <ChevronLeft size={16} />
        </button>
        
        <span style={{ 
          padding: '0.5rem 0.75rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <button 
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="btn btn-outline"
          style={{ padding: '0.5rem 0.75rem' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function FileList({ files, pagination, onFileDeleted, onPageChange }) {
  if (files.length === 0) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <File size={48} color="#6b7280" style={{ marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
            No files found
          </h3>
          <p style={{ color: '#9ca3af', margin: 0 }}>
            Upload your first file using the upload area above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                File
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Uploaded
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRow 
                key={file.filename} 
                file={file} 
                onDeleted={onFileDeleted}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination 
        pagination={pagination} 
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default FileList;
