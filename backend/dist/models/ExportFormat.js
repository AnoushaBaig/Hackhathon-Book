"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultExportFormats = exports.createExportFormat = exports.validateExportFormat = void 0;
const validateExportFormat = (format) => {
    const errors = [];
    if (!format.id || !isValidFormatId(format.id)) {
        errors.push('ID must be a standard format identifier (pdf, html, markdown)');
    }
    if (!format.mimeType || !isValidMimeType(format.mimeType)) {
        errors.push('MIME type must be a valid MIME type');
    }
    if (format.supportedFeatures && !Array.isArray(format.supportedFeatures)) {
        errors.push('Supported features must be an array of valid features');
    }
    return errors;
};
exports.validateExportFormat = validateExportFormat;
const isValidFormatId = (id) => {
    const validIds = ['pdf', 'html', 'markdown'];
    return validIds.includes(id);
};
const isValidMimeType = (mimeType) => {
    const mimeTypeRegex = /^[a-z]+\/[a-z0-9\-\+\.]+$/i;
    return mimeTypeRegex.test(mimeType);
};
const createExportFormat = (input) => {
    return {
        ...input,
        id: input.id,
    };
};
exports.createExportFormat = createExportFormat;
exports.defaultExportFormats = [
    {
        id: 'pdf',
        name: 'Portable Document Format',
        description: 'PDF format for document sharing and printing',
        mimeType: 'application/pdf',
        supportedFeatures: ['formatting', 'images', 'tables', 'toc']
    },
    {
        id: 'html',
        name: 'HyperText Markup Language',
        description: 'HTML format for web viewing',
        mimeType: 'text/html',
        supportedFeatures: ['formatting', 'images', 'links', 'styles']
    },
    {
        id: 'markdown',
        name: 'Markdown',
        description: 'Markdown format for plain text documentation',
        mimeType: 'text/markdown',
        supportedFeatures: ['formatting', 'links', 'code', 'lists']
    }
];
//# sourceMappingURL=ExportFormat.js.map