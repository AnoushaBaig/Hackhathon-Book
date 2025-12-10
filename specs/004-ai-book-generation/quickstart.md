# Quickstart Guide: AI-Driven Smart Book Generation

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Access to OpenAI API (or compatible AI service)
- Git for version control

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   Create `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   FRONTEND_PORT=3001
   ```

4. **Start the services**
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev

   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

### Usage

1. **Access the web interface**
   Open your browser to `http://localhost:3001`

2. **Create a new book project**
   - Click "New Book Project"
   - Enter the book title and topic
   - Provide a detailed description of your requirements
   - Select a structure template or define custom structure

3. **Generate content**
   - Click "Generate Book"
   - Monitor the progress in the dashboard
   - Content generation typically completes in 2-10 minutes depending on book size

4. **Export your book**
   - Once generation is complete, click "Export"
   - Choose your preferred format (PDF, HTML, Markdown)
   - Download the generated book

### API Usage

For programmatic access, use the backend API endpoints:

```bash
# Create a new book project
POST http://localhost:3000/api/v1/books
Content-Type: application/json

{
  "title": "My Technical Book",
  "topic": "AI Development",
  "description": "A comprehensive guide to AI development...",
  "structureConfig": {
    "templateId": "technical-documentation"
  }
}

# Get generation status
GET http://localhost:3000/api/v1/books/{projectId}

# Export book
POST http://localhost:3000/api/v1/books/{projectId}/export
Content-Type: application/json

{
  "format": "pdf"
}
```

### Development

To run tests:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Troubleshooting

- **API Key Issues**: Ensure your OPENAI_API_KEY is correctly set in the environment
- **Long Processing Times**: Large books (50+ pages) may take up to 10 minutes to generate
- **Export Failures**: Check available disk space and file permissions