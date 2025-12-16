"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const DocumentProcessorService_1 = require("./DocumentProcessorService");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const output_parsers_1 = require("@langchain/core/output_parsers");
const prompts_1 = require("@langchain/core/prompts");
const runnables_1 = require("@langchain/core/runnables");
const logger_1 = require("../utils/logger");
const config_1 = __importDefault(require("../config"));
const google_genai_1 = require("@langchain/google-genai");
function formatDocumentsAsString(docs) {
    return docs.map(doc => doc.pageContent).join("\n\n");
}
class ChatService {
    constructor(documentProcessor) {
        this.documentProcessor = documentProcessor || new DocumentProcessorService_1.DocumentProcessorService();
        if (config_1.default.gemini?.apiKey) {
            logger_1.logger.info('Using Google Gemini for chat functionality');
            this.chatModel = new google_genai_1.ChatGoogleGenerativeAI({
                apiKey: config_1.default.gemini.apiKey,
                model: "gemini-pro",
                temperature: 0.3,
            });
        }
        else if (process.env.OPENAI_API_KEY || config_1.default.openai?.apiKey) {
            logger_1.logger.info('Using OpenAI for chat functionality');
            this.chatModel = new openai_1.ChatOpenAI({
                openAIApiKey: process.env.OPENAI_API_KEY || config_1.default.openai?.apiKey,
                modelName: "gpt-3.5-turbo",
                temperature: 0.3,
            });
        }
        else {
            logger_1.logger.warn('No API keys configured. Chat functionality will not work.');
            this.chatModel = new openai_1.ChatOpenAI({
                openAIApiKey: "sk-fake-key-for-initialization-only",
                modelName: "gpt-3.5-turbo",
                temperature: 0.3,
            });
        }
    }
    async processQuery(query, history = []) {
        logger_1.logger.info("Processing chat query", { query: query.substring(0, 50) + "..." });
        try {
            let relevantDocs = [];
            try {
                relevantDocs = await this.documentProcessor.queryDocuments(query, 4);
                logger_1.logger.info("Found relevant documents", { count: relevantDocs.length });
            }
            catch (docError) {
                logger_1.logger.warn("Document processor unavailable, proceeding with general response", { error: docError.message });
            }
            const context = relevantDocs.length > 0
                ? formatDocumentsAsString(relevantDocs.map(doc => ({
                    pageContent: doc.content,
                    metadata: doc.metadata
                })))
                : "No specific book content is currently available, but I can still assist with general questions about AI and robotics.";
            const systemMessage = new messages_1.SystemMessage({
                content: `You are an AI assistant for the "Physical-AI-Humanoid Robots" book.
        Answer questions based on the provided book content when available.
        If the information is not in the provided context, use your general knowledge about AI and robotics to provide helpful answers.
        Be helpful, accurate, and cite relevant sections when book content is available.

        Book content context:
        ${context}`
            });
            const chatHistory = [
                systemMessage,
                ...history.map(msg => msg.role === "user"
                    ? new messages_1.HumanMessage({ content: msg.content })
                    : new messages_1.AIMessage({ content: msg.content })),
                new messages_1.HumanMessage({ content: query })
            ];
            const response = await this.chatModel.invoke(chatHistory);
            const tokensUsed = {
                prompt: this.estimateTokens(context + query),
                completion: this.estimateTokens(response.content),
                total: 0
            };
            tokensUsed.total = tokensUsed.prompt + tokensUsed.completion;
            logger_1.logger.info("Query processed successfully", {
                query: query.substring(0, 30) + "...",
                responseLength: response.content.length
            });
            return {
                response: response.content,
                sources: relevantDocs,
                tokensUsed
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error("Error processing chat query", { error: errorMessage });
            return {
                response: "I'm having trouble processing your request right now. Please try again later.",
                sources: [],
                tokensUsed: {
                    prompt: 0,
                    completion: 0,
                    total: 0
                }
            };
        }
    }
    async processQueryWithChain(query) {
        logger_1.logger.info("Processing chat query with chain", { query: query.substring(0, 50) + "..." });
        try {
            let relevantDocs = [];
            try {
                relevantDocs = await this.documentProcessor.queryDocuments(query, 4);
            }
            catch (docError) {
                logger_1.logger.warn("Document processor unavailable for chain query", { error: docError.message });
            }
            const context = relevantDocs.length > 0
                ? formatDocumentsAsString(relevantDocs.map(doc => ({
                    pageContent: doc.content,
                    metadata: doc.metadata
                })))
                : "No specific book content is currently available, but I can still assist with general questions about AI and robotics.";
            const template = `You are an AI assistant for the "Physical-AI-Humanoid Robots" book.
      Use the following context to answer the question at the end.
      If the information is not in the provided context, use your general knowledge about AI and robotics to provide helpful answers.

      Context:
      {context}

      Question: {question}

      Helpful Answer:`;
            const prompt = prompts_1.PromptTemplate.fromTemplate(template);
            const chain = runnables_1.RunnableSequence.from([
                {
                    context: () => context,
                    question: (input) => input,
                },
                prompt,
                this.chatModel,
                new output_parsers_1.StringOutputParser(),
            ]);
            const response = await chain.invoke(query);
            const tokensUsed = {
                prompt: this.estimateTokens(context + query),
                completion: this.estimateTokens(response),
                total: 0
            };
            tokensUsed.total = tokensUsed.prompt + tokensUsed.completion;
            logger_1.logger.info("Query with chain processed successfully", {
                query: query.substring(0, 30) + "...",
                responseLength: response.length
            });
            return {
                response,
                sources: relevantDocs,
                tokensUsed
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error("Error processing chat query with chain", { error: errorMessage });
            return {
                response: "I'm having trouble processing your request right now. Please try again later.",
                sources: [],
                tokensUsed: {
                    prompt: 0,
                    completion: 0,
                    total: 0
                }
            };
        }
    }
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    }
    async initializeBookContent(docsPath) {
        logger_1.logger.info("Initializing book content for chatbot");
        await this.documentProcessor.processBookContent(docsPath);
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=ChatService.js.map