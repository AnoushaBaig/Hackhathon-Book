export interface DocumentProcessorConfig {
    chunkSize?: number;
    chunkOverlap?: number;
    collectionName?: string;
}
export declare class DocumentProcessorService {
    private embeddings;
    private splitter;
    private config;
    constructor(config?: DocumentProcessorConfig);
    processBookContent(docsPath?: string): Promise<void>;
    private getAllMarkdownFiles;
    private processMarkdownFile;
    private extractTitle;
    private removeFrontmatter;
    private addToVectorStore;
    queryDocuments(query: string, topK?: number): Promise<any[]>;
}
//# sourceMappingURL=DocumentProcessorService.d.ts.map