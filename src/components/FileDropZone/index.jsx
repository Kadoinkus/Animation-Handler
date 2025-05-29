/* global FileReader, alert */
import React, { useState } from 'react';
import styles from './FileDropZone.module.css';

/**
 * FileDropZone Component
 * Handles file drag and drop functionality for CSV files
 *
 * @param {Object} props
 * @param {Function} props.onFileUpload - Callback function to handle the uploaded file content
 */
const FileDropZone = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onFileUpload(event.target.result);
        };
        reader.readAsText(file);
      } else {
        alert('Please drop a CSV file');
      }
    }
  };

  return (
    <div
      className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging ? 'Drop CSV file here' : 'Drag and drop a CSV file here'}
    </div>
  );
};

export default FileDropZone;
