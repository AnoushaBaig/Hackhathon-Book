# API Contract: Book Generation Service

## Overview
This document defines the API contracts for the AI-Driven Smart Book Generation service.

## Base URL
`http://localhost:3000/api/v1` (or configured base URL)

## Authentication
All endpoints require a valid API key in the `Authorization` header:
```
Authorization: Bearer {your-api-key}
```

## Endpoints

### POST /books
Create a new book generation project.

**Request Body:**
```json
{
  "title": "string (required, 1-200 chars)",
  "topic": "string (required)",
  "description": "string (required, 10-5000 chars)",
  "structureConfig": {
    "templateId": "string (optional, defaults to 'default')"
  },
  "styleGuide": {
    "tone": "technical|educational|professional|casual (optional)",
    "targetAudience": "beginner|intermediate|advanced (optional)",
    "writingStyle": "concise|detailed|balanced (optional)"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "string",
  "title": "string",
  "topic": "string",
  "description": "string",
  "generationStatus": "pending",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### GET /books/{id}
Get the status and details of a book generation project.

**Response (200 OK):**
```json
{
  "id": "string",
  "title": "string",
  "topic": "string",
  "description": "string",
  "generationStatus": "pending|in-progress|completed|failed",
  "generatedContentId": "string (when completed)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

### POST /books/{id}/export
Export the generated book in the specified format.

**Request Body:**
```json
{
  "format": "pdf|html|markdown (required)"
}
```

**Response (200 OK):**
```json
{
  "downloadUrl": "string (URL to download the exported book)",
  "format": "string (the format that was exported)",
  "fileSize": "number (file size in bytes)",
  "createdAt": "ISO date string"
}
```

### GET /templates
Get available book structure templates.

**Response (200 OK):**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "isDefault": "boolean"
  }
]
```

## Error Responses
All error responses follow this structure:
```json
{
  "error": {
    "code": "string (error code)",
    "message": "string (human-readable error message)",
    "details": "object (optional additional error details)"
  }
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (invalid API key)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error