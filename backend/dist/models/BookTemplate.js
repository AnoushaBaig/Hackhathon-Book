"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTemplates = exports.createBookTemplate = exports.validateBookTemplate = void 0;
const validateBookTemplate = (template) => {
    const errors = [];
    if (!template.name) {
        errors.push('Template name is required');
    }
    if (template.structure && !isValidBookStructure(template.structure)) {
        errors.push('Structure must follow proper hierarchy');
    }
    if (template.exportFormats && !isValidExportFormats(template.exportFormats)) {
        errors.push('Export formats must contain valid format identifiers');
    }
    return errors;
};
exports.validateBookTemplate = validateBookTemplate;
const isValidBookStructure = (structure) => {
    return structure.title !== undefined && structure.level !== undefined;
};
const isValidExportFormats = (formats) => {
    const validFormats = ['pdf', 'html', 'markdown'];
    return formats.every(format => validFormats.includes(format));
};
const createBookTemplate = (input) => {
    return {
        id: generateId(),
        ...input,
        isDefault: input.isDefault || false,
    };
};
exports.createBookTemplate = createBookTemplate;
const generateId = () => {
    return `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
exports.defaultTemplates = [
    {
        id: 'default-tech',
        name: 'Technical Documentation',
        description: 'Template for technical documentation with API references, code examples, and architecture diagrams',
        structure: {
            title: 'Technical Documentation',
            level: 1,
            content: '',
            children: [],
            type: 'chapter'
        },
        styleGuide: {
            tone: 'technical',
            targetAudience: 'intermediate',
            writingStyle: 'concise',
            terminology: []
        },
        exportFormats: ['pdf', 'html', 'markdown'],
        isDefault: true
    }
];
//# sourceMappingURL=BookTemplate.js.map