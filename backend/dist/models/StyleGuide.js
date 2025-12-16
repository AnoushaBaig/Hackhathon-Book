"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultStyleGuides = exports.createStyleGuide = exports.validateStyleGuide = void 0;
const validateStyleGuide = (styleGuide) => {
    const errors = [];
    const validTones = ['technical', 'educational', 'professional', 'casual'];
    if (styleGuide.tone && !validTones.includes(styleGuide.tone)) {
        errors.push('Tone must be one of: technical, educational, professional, casual');
    }
    const validAudiences = ['beginner', 'intermediate', 'advanced'];
    if (styleGuide.targetAudience && !validAudiences.includes(styleGuide.targetAudience)) {
        errors.push('Target audience must be one of: beginner, intermediate, advanced');
    }
    const validStyles = ['concise', 'detailed', 'balanced'];
    if (styleGuide.writingStyle && !validStyles.includes(styleGuide.writingStyle)) {
        errors.push('Writing style must be one of: concise, detailed, balanced');
    }
    return errors;
};
exports.validateStyleGuide = validateStyleGuide;
const createStyleGuide = (input) => {
    return {
        tone: input.tone || 'professional',
        targetAudience: input.targetAudience || 'intermediate',
        writingStyle: input.writingStyle || 'balanced',
        terminology: input.terminology || [],
    };
};
exports.createStyleGuide = createStyleGuide;
exports.defaultStyleGuides = [
    {
        tone: 'technical',
        targetAudience: 'intermediate',
        writingStyle: 'concise',
        terminology: []
    },
    {
        tone: 'educational',
        targetAudience: 'beginner',
        writingStyle: 'detailed',
        terminology: []
    }
];
//# sourceMappingURL=StyleGuide.js.map