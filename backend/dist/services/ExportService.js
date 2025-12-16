"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const logger_1 = require("../utils/logger");
const ExportFormat_1 = require("../models/ExportFormat");
class ExportService {
    async exportBook(bookId, format) {
        logger_1.logger.info('Exporting book', { bookId, format });
        if (!this.isValidFormat(format)) {
            throw new Error(`Invalid export format: ${format}`);
        }
        try {
            const exportedContent = await this.convertToFormat(bookId, format);
            const result = {
                downloadUrl: `/api/v1/books/${bookId}/download/${format}`,
                format,
                fileSize: exportedContent.length,
                createdAt: new Date(),
            };
            logger_1.logger.info('Book exported successfully', { bookId, format, downloadUrl: result.downloadUrl });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error('Error exporting book', { bookId, format, error: errorMessage });
            throw new Error(`Export failed: ${errorMessage}`);
        }
    }
    async convertToFormat(bookId, format) {
        switch (format) {
            case 'pdf':
                return this.toPdfFormat(bookId);
            case 'html':
                return this.toHtmlFormat(bookId);
            case 'markdown':
                return this.toMarkdownFormat(bookId);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }
    async toPdfFormat(bookId) {
        logger_1.logger.info('Converting to PDF format', { bookId });
        return `PDF_CONTENT_${bookId}`;
    }
    async toHtmlFormat(bookId) {
        logger_1.logger.info('Converting to HTML format', { bookId });
        return `<!DOCTYPE html>
<html>
<head>
  <title>Book ${bookId}</title>
  <meta charset="UTF-8">
</head>
<body>
  <h1>Book Content for ${bookId}</h1>
  <p>This is the HTML version of the generated book.</p>
  <p>Actual content would be properly formatted here.</p>
</body>
</html>`;
    }
    async toMarkdownFormat(bookId) {
        logger_1.logger.info('Converting to Markdown format', { bookId });
        return `# Book ${bookId}

This is the Markdown version of the generated book.

## Content

Actual content would be properly formatted here using Markdown syntax.
`;
    }
    isValidFormat(format) {
        const validFormats = ['pdf', 'html', 'markdown'];
        return validFormats.includes(format);
    }
    getAvailableFormats() {
        logger_1.logger.info('Retrieving available export formats');
        return ExportFormat_1.defaultExportFormats.map(f => f.id);
    }
}
exports.ExportService = ExportService;
//# sourceMappingURL=ExportService.js.map