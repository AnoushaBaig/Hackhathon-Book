import { DocumentProcessorService } from "./DocumentProcessorService";
export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}
export interface ChatQueryResponse {
    response: string;
    sources: Array<{
        content: string;
        metadata: any;
    }>;
    tokensUsed: {
        prompt: number;
        completion: number;
        total: number;
    };
}
export declare class ChatService {
    private documentProcessor;
    private chatModel;
    constructor(documentProcessor?: DocumentProcessorService);
    processQuery(query: string, history?: ChatMessage[]): Promise<ChatQueryResponse>;
    processQueryWithChain(query: string): Promise<ChatQueryResponse>;
    private estimateTokens;
    initializeBookContent(docsPath?: string): Promise<void>;
}
//# sourceMappingURL=ChatService.d.ts.map