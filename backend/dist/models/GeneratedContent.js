"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGeneratedContent = exports.validateGeneratedContent = void 0;
const validateGeneratedContent = (content) => {
    const errors = [];
    if (!content.content || content.content.trim() === '') {
        errors.push('Content must be provided and non-empty');
    }
    if (!content.projectId) {
        errors.push('Project ID must reference an existing BookProject');
    }
    if (content.qualityScore !== undefined && (content.qualityScore < 0 || content.qualityScore > 100)) {
        errors.push('Quality score must be between 0 and 100');
    }
    return errors;
};
exports.validateGeneratedContent = validateGeneratedContent;
const createGeneratedContent = (input) => {
    const now = new Date();
    return {
        id: generateId(),
        ...input,
        createdAt: now,
        updatedAt: now,
    };
};
exports.createGeneratedContent = createGeneratedContent;
const generateId = () => {
    return `gc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
//# sourceMappingURL=GeneratedContent.js.map