// BookGenerator component
import React, { useState } from 'react';
import apiClient from '../../services/apiClient';
import './BookGenerator.css';

interface BookGeneratorProps {
  onBookCreated?: (bookId: string) => void;
}

interface FormData {
  title: string;
  topic: string;
  description: string;
  templateId?: string;
}

const BookGenerator: React.FC<BookGeneratorProps> = ({ onBookCreated }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    topic: '',
    description: '',
    templateId: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  // Load templates on component mount
  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await apiClient.get('/templates');
      setTemplates(response);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/books', {
        title: formData.title,
        topic: formData.topic,
        description: formData.description,
        structureConfig: formData.templateId ? { templateId: formData.templateId } : undefined,
      });

      if (onBookCreated && response.id) {
        onBookCreated(response.id);
      }

      // Reset form
      setFormData({
        title: '',
        topic: '',
        description: '',
        templateId: undefined,
      });
    } catch (err) {
      console.error('Failed to create book:', err);
      setError('Failed to create book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-generator">
      <h2>Generate New Book</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Book Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="templateId">Template (optional):</label>
          <select
            id="templateId"
            name="templateId"
            value={formData.templateId || ''}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Default template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Generating...' : 'Generate Book'}
        </button>
      </form>
    </div>
  );
};

export default BookGenerator;