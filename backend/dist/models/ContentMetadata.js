"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContentMetadata = exports.validateContentMetadata = void 0;
const validateContentMetadata = (metadata) => {
    const errors = [];
    if (metadata.wordCount !== undefined && metadata.wordCount < 0) {
        errors.push('Word count must be non-negative');
    }
    if (metadata.readingTime !== undefined && metadata.readingTime < 0) {
        errors.push('Reading time must be non-negative');
    }
    if (metadata.complexityScore !== undefined && (metadata.complexityScore < 0 || metadata.complexityScore > 100)) {
        errors.push('Complexity score must be between 0 and 100');
    }
    return errors;
};
exports.validateContentMetadata = validateContentMetadata;
const createContentMetadata = (input) => {
    return {
        wordCount: input.wordCount || 0,
        readingTime: input.readingTime || 0,
        complexityScore: input.complexityScore || 0,
        topicsCovered: input.topicsCovered || [],
        references: input.references || [],
    };
};
exports.createContentMetadata = createContentMetadata;
//# sourceMappingURL=ContentMetadata.js.map