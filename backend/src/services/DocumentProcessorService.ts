// DocumentProcessorService for processing book content for RAG
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { promises as fs } from "fs";
import * as path from "path";
import { logger } from "../utils/logger";

export interface DocumentProcessorConfig {
  chunkSize?: number;
  chunkOverlap?: number;
  collectionName?: string;
}

export class DocumentProcessorService {
  private embeddings: OpenAIEmbeddings | null;
  private splitter: RecursiveCharacterTextSplitter;
  private config: DocumentProcessorConfig;

  constructor(config?: DocumentProcessorConfig) {
    this.config = {
      chunkSize: 1000,
      chunkOverlap: 200,
      collectionName: "book_content",
      ...config
    };

    // Initialize OpenAI embeddings - note: for Gemini, you would need to use a different embedding service
    // For now, we'll continue using OpenAI embeddings as Google doesn't provide direct embedding support
    if (process.env.OPENAI_API_KEY) {
      this.embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      // Fallback: use a mock embeddings service if no API key is available
      logger.warn('No OpenAI API key provided. Document processing for RAG will not work.');
      this.embeddings = null as any; // We'll handle this in the methods
    }

    // Initialize text splitter
    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.config.chunkSize,
      chunkOverlap: this.config.chunkOverlap,
    });
  }

  // Process all book content from the docs directory
  async processBookContent(docsPath: string = "../../../Ai-Robotics-Book/docs"): Promise<void> {
    logger.info("Starting document processing for book content", { docsPath });

    // Check if embeddings are available before attempting to process
    if (!this.embeddings) {
      logger.warn("No embeddings service available. Skipping document processing.");
      return;
    }

    try {
      // Get all markdown files from the docs directory
      const mdFiles = await this.getAllMarkdownFiles(path.join(process.cwd(), docsPath));

      logger.info("Found markdown files to process", { count: mdFiles.length });

      // Process each markdown file
      for (const filePath of mdFiles) {
        logger.info("Processing file", { filePath });
        await this.processMarkdownFile(filePath);
      }

      logger.info("Document processing completed successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error processing book content", { error: errorMessage });
      // Don't throw the error - allow the system to continue working with basic functionality
      logger.warn("Document processing failed, but chat functionality will still work with limited context.");
    }
  }

  // Get all markdown files recursively from a directory
  private async getAllMarkdownFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        // Recursively get files from subdirectories
        const subDirFiles = await this.getAllMarkdownFiles(fullPath);
        files.push(...subDirFiles);
      } else if (item.name.endsWith('.md')) {
        // Only add markdown files
        files.push(fullPath);
      }
    }

    return files;
  }

  // Process a single markdown file
  private async processMarkdownFile(filePath: string): Promise<void> {
    try {
      // Check if embeddings are available before attempting to process
      if (!this.embeddings) {
        logger.warn("No embeddings service available. Skipping file processing for:", { filePath });
        return;
      }

      // Read the markdown file content
      const content = await fs.readFile(filePath, 'utf-8');

      // Extract title from the file (first heading)
      const title = this.extractTitle(content) || path.basename(filePath, '.md');

      // Remove frontmatter if present
      const cleanContent = this.removeFrontmatter(content);

      // Split the content into chunks
      const docs = await this.splitter.createDocuments([cleanContent], [{
        title: title,
        source: filePath
      }]);

      // Add metadata to each document chunk
      const docsWithMetadata = docs.map((doc: Document) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          title: title,
          source: filePath,
          fileName: path.basename(filePath),
          relativePath: path.relative(process.cwd(), filePath)
        }
      }));

      // Add documents to vector store
      await this.addToVectorStore(docsWithMetadata);

      logger.info("Processed file successfully", { filePath, chunks: docsWithMetadata.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error processing markdown file", { filePath, error: errorMessage });
      // Don't throw the error - allow the system to continue processing other files
    }
  }

  // Extract title from markdown content (first heading)
  private extractTitle(content: string): string | null {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    return null;
  }

  // Remove frontmatter from markdown content
  private removeFrontmatter(content: string): string {
    // Look for YAML frontmatter between --- delimiters
    const frontmatterRegex = /^---\s*\n.*?\n---\s*\n/s;
    const match = content.match(frontmatterRegex);

    if (match) {
      // Remove frontmatter and return the rest
      return content.slice(match[0].length);
    }

    return content;
  }

  // Add documents to vector store
  private async addToVectorStore(docs: Array<{ pageContent: string; metadata: any }>): Promise<void> {
    try {
      if (!this.embeddings) {
        logger.warn("No embeddings service available. Skipping vector store addition.");
        return;
      }

      // Connect to Qdrant vector store
      const vectorStore = await QdrantVectorStore.fromDocuments(docs, this.embeddings, {
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: this.config.collectionName,
      });

      logger.info("Documents added to vector store", { count: docs.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error adding documents to vector store", { error: errorMessage });
      throw error;
    }
  }

  // Query the vector store for relevant documents
  async queryDocuments(query: string, topK: number = 4): Promise<any[]> {
    try {
      if (!this.embeddings) {
        logger.warn("No embeddings service available. Returning empty results.");
        return []; // Return empty array when no embeddings are available
      }

      // Connect to Qdrant vector store
      const vectorStore = new QdrantVectorStore(this.embeddings, {
        url: process.env.QDRANT_URL || "http://localhost:6333",
        collectionName: this.config.collectionName,
      });

      // Perform similarity search
      const results = await vectorStore.similaritySearch(query, topK);

      logger.info("Query completed", { query: query.substring(0, 50) + "...", results: results.length });

      return results.map((result: Document) => ({
        content: result.pageContent,
        metadata: result.metadata
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error("Error querying documents", { error: errorMessage });
      return []; // Return empty array on error to allow chat to continue
    }
  }
}