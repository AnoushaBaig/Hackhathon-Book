"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBookStructures = exports.createBookStructure = exports.validateBookStructure = void 0;
const validateBookStructure = (structure) => {
    const errors = [];
    if (structure.level < 1 || structure.level > 6) {
        errors.push('Level must be between 1 and 6');
    }
    const validTypes = ['chapter', 'section', 'subsection', 'appendix'];
    if (!validTypes.includes(structure.type)) {
        errors.push('Type must be one of: chapter, section, subsection, appendix');
    }
    if (structure.children && structure.children.length > 0) {
        for (const child of structure.children) {
            if (child.level <= structure.level) {
                errors.push('Children must have hierarchy levels higher than their parent');
            }
            errors.push(...(0, exports.validateBookStructure)(child));
        }
    }
    return errors;
};
exports.validateBookStructure = validateBookStructure;
const createBookStructure = (input) => {
    return {
        ...input,
        children: input.children || [],
    };
};
exports.createBookStructure = createBookStructure;
exports.defaultBookStructures = [
    {
        title: 'Introduction',
        level: 1,
        content: '',
        children: [],
        type: 'chapter'
    },
    {
        title: 'Chapter 1',
        level: 1,
        content: '',
        children: [
            {
                title: 'Section 1.1',
                level: 2,
                content: '',
                children: [],
                type: 'section'
            }
        ],
        type: 'chapter'
    }
];
//# sourceMappingURL=BookStructure.js.map