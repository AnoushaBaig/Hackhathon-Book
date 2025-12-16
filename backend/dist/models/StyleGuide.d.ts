export interface StyleGuide {
    tone: 'technical' | 'educational' | 'professional' | 'casual';
    targetAudience: 'beginner' | 'intermediate' | 'advanced';
    writingStyle: 'concise' | 'detailed' | 'balanced';
    terminology: string[];
}
export declare const validateStyleGuide: (styleGuide: Partial<StyleGuide>) => string[];
export declare const createStyleGuide: (input: Partial<StyleGuide>) => StyleGuide;
export declare const defaultStyleGuides: StyleGuide[];
//# sourceMappingURL=StyleGuide.d.ts.map