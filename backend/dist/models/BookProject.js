"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookProject = exports.validateBookProject = void 0;
const validateBookProject = (project) => {
    const errors = [];
    if (!project.title || project.title.length < 1 || project.title.length > 200) {
        errors.push('Title must be between 1 and 200 characters');
    }
    if (!project.topic) {
        errors.push('Topic is required');
    }
    if (!project.description || project.description.length < 10 || project.description.length > 5000) {
        errors.push('Description must be between 10 and 5000 characters');
    }
    if (project.generationStatus && !['pending', 'in-progress', 'completed', 'failed'].includes(project.generationStatus)) {
        errors.push('Generation status must be one of: pending, in-progress, completed, failed');
    }
    return errors;
};
exports.validateBookProject = validateBookProject;
const createBookProject = (input) => {
    const now = new Date();
    return {
        id: generateId(),
        ...input,
        generationStatus: input.generationStatus || 'pending',
        createdAt: now,
        updatedAt: now,
    };
};
exports.createBookProject = createBookProject;
const generateId = () => {
    return `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
//# sourceMappingURL=BookProject.js.map