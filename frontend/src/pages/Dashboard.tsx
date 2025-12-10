// Dashboard page to display book projects
import React, { useState, useEffect } from 'react';
import BookGenerator from '../components/BookGenerator';
import apiClient from '../services/apiClient';
import './Dashboard.css';

interface BookProject {
  id: string;
  title: string;
  topic: string;
  description: string;
  generationStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  generatedContentId?: string;
}

const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<BookProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real implementation, this would fetch the list of books
      // For now, we'll use mock data
      const mockBooks: BookProject[] = [
        {
          id: 'bp_12345',
          title: 'Introduction to AI',
          topic: 'Artificial Intelligence',
          description: 'A comprehensive guide to artificial intelligence concepts',
          generationStatus: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          generatedContentId: 'gc_67890',
        },
        {
          id: 'bp_23456',
          title: 'Machine Learning Basics',
          topic: 'Machine Learning',
          description: 'Fundamentals of machine learning algorithms',
          generationStatus: 'in-progress',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setBooks(mockBooks);
    } catch (err) {
      console.error('Failed to load books:', err);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookCreated = (bookId: string) => {
    // Refresh the list after a new book is created
    loadBooks();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'orange';
      case 'pending': return 'blue';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="dashboard">
      <h1>AI Book Generator Dashboard</h1>

      <div className="dashboard-content">
        <div className="left-panel">
          <BookGenerator onBookCreated={handleBookCreated} />
        </div>

        <div className="right-panel">
          <h2>Your Book Projects</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">Loading books...</div>
          ) : (
            <div className="book-list">
              {books.length === 0 ? (
                <p>No book projects yet. Create your first book using the form.</p>
              ) : (
                books.map(book => (
                  <div key={book.id} className="book-card">
                    <h3>{book.title}</h3>
                    <p className="topic">Topic: {book.topic}</p>
                    <p className="description">{book.description}</p>
                    <div className="status">
                      Status: <span style={{ color: getStatusColor(book.generationStatus) }}>{book.generationStatus}</span>
                    </div>
                    <div className="created-date">
                      Created: {new Date(book.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;