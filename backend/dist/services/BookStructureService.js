"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookStructureService = void 0;
const BookTemplate_1 = require("../models/BookTemplate");
const logger_1 = require("../utils/logger");
class BookStructureService {
    getTemplates() {
        logger_1.logger.info('Retrieving available book templates', { count: BookTemplate_1.defaultTemplates.length });
        return [...BookTemplate_1.defaultTemplates];
    }
    getTemplateById(id) {
        logger_1.logger.info('Retrieving template by ID', { id });
        return BookTemplate_1.defaultTemplates.find(template => template.id === id);
    }
    validateStructure(structure) {
        const errors = this.validateBookStructure(structure);
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateBookStructure(structure) {
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
                errors.push(...this.validateBookStructure(child));
            }
        }
        return errors;
    }
    applyTemplate(structure, templateId) {
        logger_1.logger.info('Applying template to book structure', { templateId });
        const template = this.getTemplateById(templateId);
        if (!template) {
            throw new Error(`Template with ID ${templateId} not found`);
        }
        return {
            ...structure,
            ...template.structure,
            children: template.structure.children
        };
    }
    applyStyleGuide(content, styleGuide) {
        logger_1.logger.info('Applying style guide to content', {
            tone: styleGuide.tone,
            targetAudience: styleGuide.targetAudience,
            writingStyle: styleGuide.writingStyle
        });
        let styledContent = content;
        if (styleGuide.targetAudience === 'beginner') {
            styledContent = this.simplifyContent(styledContent);
        }
        else if (styleGuide.targetAudience === 'advanced') {
            styledContent = this.addTechnicalDepth(styledContent);
        }
        if (styleGuide.writingStyle === 'concise') {
            styledContent = this.makeConcise(styledContent);
        }
        else if (styleGuide.writingStyle === 'detailed') {
            styledContent = this.addDetails(styledContent);
        }
        return styledContent;
    }
    simplifyContent(content) {
        return content.replace(/\b(?:therefore|consequently|subsequently|nevertheless|accordingly)\b/gi, 'so');
    }
    addTechnicalDepth(content) {
        return content;
    }
    makeConcise(content) {
        return content;
    }
    addDetails(content) {
        return content;
    }
}
exports.BookStructureService = BookStructureService;
//# sourceMappingURL=BookStructureService.js.map