export interface ContentMetadata {
    wordCount: number;
    readingTime: number;
    complexityScore: number;
    topicsCovered: string[];
    references: string[];
}
export declare const validateContentMetadata: (metadata: Partial<ContentMetadata>) => string[];
export declare const createContentMetadata: (input: Partial<ContentMetadata>) => ContentMetadata;
//# sourceMappingURL=ContentMetadata.d.ts.map