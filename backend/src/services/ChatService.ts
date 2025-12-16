// ChatService for handling chat queries with RAG functionality
import { DocumentProcessorService } from "./DocumentProcessorService";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
// No import needed - we'll implement the function directly
import { logger } from "../utils/logger";
import config from "../config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Function to format documents as a string
function formatDocumentsAsString(docs: Array<{ pageContent: string; metadata: any }>): string {
  return docs.map(doc => doc.pageContent).join("\n\n");
}

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

export class ChatService {
  private documentProcessor: DocumentProcessorService;
  private chatModel: ChatOpenAI | ChatGoogleGenerativeAI;

  constructor(documentProcessor?: DocumentProcessorService) {
    this.documentProcessor = documentProcessor || new DocumentProcessorService();

    // Initialize chat model based on available API keys
    // Prefer Gemini if available, otherwise fallback to OpenAI
    if (config.gemini?.apiKey) {
      logger.info('Using Google Gemini for chat functionality');
      this.chatModel = new ChatGoogleGenerativeAI({
        apiKey: config.gemini.apiKey,
        model: "gemini-pro",
        temperature: 0.3,
      });
    } else if (process.env.OPENAI_API_KEY || config.openai?.apiKey) {
      logger.info('Using OpenAI for chat functionality');
      this.chatModel = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY || config.openai?.apiKey,
        modelName: "gpt-3.5-turbo", // You can change this to gpt-4 if preferred
        temperature: 0.3, // Lower temperature for more consistent answers
      });
    } else {
      logger.warn('No API keys configured. Chat functionality will not work.');
      // Create a mock model that returns default responses
      // We'll handle this in the methods
      this.chatModel = new ChatOpenAI({
        openAIApiKey: "sk-fake-key-for-initialization-only", // This will cause errors if actually used
        modelName: "gpt-3.5-turbo",
        temperature: 0.3,
      });
    }
  }

  // Process a chat query using RAG
  async processQuery(query: string, history: ChatMessage[] = []): Promise<ChatQueryResponse> {
    logger.info("Processing chat query", { query: query.substring(0, 50) + "..." });

    try {
      // Get relevant documents from the vector store (with error handling)
      let relevantDocs = [];
      try {
        relevantDocs = await this.documentProcessor.queryDocuments(query, 4);
        logger.info("Found relevant documents", { count: relevantDocs.length });
      } catch (docError) {
        logger.warn("Document processor unavailable, proceeding with general response", { error: (docError as Error).message });
        // Continue with empty relevantDocs array
      }

      // Create context from relevant documents (or empty if none available)
      const context = relevantDocs.length > 0
        ? formatDocumentsAsString(
            relevantDocs.map(doc => ({
              pageContent: doc.content,
              metadata: doc.metadata
            }))
          )
        : "No specific book content is currently available, but I can still assist with general questions about AI and robotics.";

      // Create a system message with context from the book
      const systemMessage = new SystemMessage({
        content: `You are an AI assistant for the "Physical-AI-Humanoid Robots" book.
        Answer questions based on the provided book content when available.
        If the information is not in the provided context, use your general knowledge about AI and robotics to provide helpful answers.
        Be helpful, accurate, and cite relevant sections when book content is available.

        Book content context:
        ${context}`
      });

      // Create chat history
      const chatHistory = [
        systemMessage,
        ...history.map(msg =>
          msg.role === "user"
            ? new HumanMessage({ content: msg.content })
            : new AIMessage({ content: msg.content })
        ),
        new HumanMessage({ content: query })
      ];

      // Generate response using the chat model
      const response = await this.chatModel.invoke(chatHistory);

      // Calculate approximate token usage
      const tokensUsed = {
        prompt: this.estimateTokens(context + query),
        completion: this.estimateTokens(response.content as string),
        total: 0
      };
      tokensUsed.total = tokensUsed.prompt + tokensUsed.completion;

      logger.info("Query processed successfully", {
        query: query.substring(0, 30) + "...",
        responseLength: (response.content as string).length
      });

      return {
        response: response.content as string,
        sources: relevantDocs,
        tokensUsed
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error processing chat query", { error: errorMessage });

      // Provide a fallback response instead of throwing
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

  // Alternative RAG approach using LangChain's retrieval chain
  async processQueryWithChain(query: string): Promise<ChatQueryResponse> {
    logger.info("Processing chat query with chain", { query: query.substring(0, 50) + "..." });

    try {
      // Get relevant documents from the vector store (with error handling)
      let relevantDocs = [];
      try {
        relevantDocs = await this.documentProcessor.queryDocuments(query, 4);
      } catch (docError) {
        logger.warn("Document processor unavailable for chain query", { error: (docError as Error).message });
        // Continue with empty relevantDocs array
      }

      // Create context from relevant documents (or empty if none available)
      const context = relevantDocs.length > 0
        ? formatDocumentsAsString(
            relevantDocs.map(doc => ({
              pageContent: doc.content,
              metadata: doc.metadata
            }))
          )
        : "No specific book content is currently available, but I can still assist with general questions about AI and robotics.";

      // Define the prompt template
      const template = `You are an AI assistant for the "Physical-AI-Humanoid Robots" book.
      Use the following context to answer the question at the end.
      If the information is not in the provided context, use your general knowledge about AI and robotics to provide helpful answers.

      Context:
      {context}

      Question: {question}

      Helpful Answer:`;

      const prompt = PromptTemplate.fromTemplate(template);

      // Create the chain
      const chain = RunnableSequence.from([
        {
          context: () => context,
          question: (input: string) => input,
        },
        prompt,
        this.chatModel,
        new StringOutputParser(),
      ]);

      // Execute the chain
      const response = await chain.invoke(query);

      // Calculate approximate token usage
      const tokensUsed = {
        prompt: this.estimateTokens(context + query),
        completion: this.estimateTokens(response),
        total: 0
      };
      tokensUsed.total = tokensUsed.prompt + tokensUsed.completion;

      logger.info("Query with chain processed successfully", {
        query: query.substring(0, 30) + "...",
        responseLength: response.length
      });

      return {
        response,
        sources: relevantDocs,
        tokensUsed
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error processing chat query with chain", { error: errorMessage });

      // Provide a fallback response instead of throwing
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

  // Estimate token count (rough estimation - 1 token ~ 4 characters)
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  // Initialize the document processor with book content
  async initializeBookContent(docsPath?: string) {
    logger.info("Initializing book content for chatbot");
    await this.documentProcessor.processBookContent(docsPath);
  }
}