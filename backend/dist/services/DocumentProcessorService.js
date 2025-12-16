"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessorService = void 0;
const textsplitters_1 = require("@langchain/textsplitters");
const openai_1 = require("@langchain/openai");
const qdrant_1 = require("@langchain/qdrant");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const logger_1 = require("../utils/logger");
class DocumentProcessorService {
    constructor(config) {
        this.config = {
            chunkSize: 1000,
            chunkOverlap: 200,
            collectionName: "book_content",
            ...config
        };
        if (process.env.OPENAI_API_KEY) {
            this.embeddings = new openai_1.OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY,
            });
        }
        else {
            logger_1.logger.warn('No OpenAI API key provided. Document processing for RAG will not work.');
            this.embeddings = null;
        }
        this.splitter = new textsplitters_1.RecursiveCharacterTextSplitter({
            chunkSize: this.config.chunkSize,
            chunkOverlap: this.config.chunkOverlap,
        });
    }
    async processBookContent(docsPath = "../../../Ai-Robotics-Book/docs") {
        logger_1.logger.info("Starting document processing for book content", { docsPath });
        if (!this.embeddings) {
            logger_1.logger.warn("No embeddings service available. Skipping document processing.");
            return;
        }
        try {
            const mdFiles = await this.getAllMarkdownFiles(path.join(process.cwd(), docsPath));
            logger_1.logger.info("Found markdown files to process", { count: mdFiles.length });
            for (const filePath of mdFiles) {
                logger_1.logger.info("Processing file", { filePath });
                await this.processMarkdownFile(filePath);
            }
            logger_1.logger.info("Document processing completed successfully");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error("Error processing book content", { error: errorMessage });
            logger_1.logger.warn("Document processing failed, but chat functionality will still work with limited context.");
        }
    }
    async getAllMarkdownFiles(dirPath) {
        const files = [];
        const items = await fs_1.promises.readdir(dirPath, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dirPath, item.name);
            if (item.isDirectory()) {
                const subDirFiles = await this.getAllMarkdownFiles(fullPath);
                files.push(...subDirFiles);
            }
            else if (item.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
        return files;
    }
    async processMarkdownFile(filePath) {
        try {
            if (!this.embeddings) {
                logger_1.logger.warn("No embeddings service available. Skipping file processing for:", { filePath });
                return;
            }
            const content = await fs_1.promises.readFile(filePath, 'utf-8');
            const title = this.extractTitle(content) || path.basename(filePath, '.md');
            const cleanContent = this.removeFrontmatter(content);
            const docs = await this.splitter.createDocuments([cleanContent], [{
                    title: title,
                    source: filePath
                }]);
            const docsWithMetadata = docs.map((doc) => ({
                ...doc,
                metadata: {
                    ...doc.metadata,
                    title: title,
                    source: filePath,
                    fileName: path.basename(filePath),
                    relativePath: path.relative(process.cwd(), filePath)
                }
            }));
            await this.addToVectorStore(docsWithMetadata);
            logger_1.logger.info("Processed file successfully", { filePath, chunks: docsWithMetadata.length });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error("Error processing markdown file", { filePath, error: errorMessage });
        }
    }
    extractTitle(content) {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            return titleMatch[1].trim();
        }
        return null;
    }
    removeFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n.*?\n---\s*\n/s;
        const match = content.match(frontmatterRegex);
        if (match) {
            return content.slice(match[0].length);
        }
        return content;
    }
    async addToVectorStore(docs) {
        try {
            if (!this.embeddings) {
                logger_1.logger.warn("No embeddings service available. Skipping vector store addition.");
                return;
            }
            const vectorStore = await qdrant_1.QdrantVectorStore.fromDocuments(docs, this.embeddings, {
                url: process.env.QDRANT_URL || "http://localhost:6333",
                collectionName: this.config.collectionName,
            });
            logger_1.logger.info("Documents added to vector store", { count: docs.length });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error("Error adding documents to vector store", { error: errorMessage });
            throw error;
        }
    }
    async queryDocuments(query, topK = 4) {
        try {
            if (!this.embeddings) {
                logger_1.logger.warn("No embeddings service available. Returning empty results.");
                return [];
            }
            const vectorStore = new qdrant_1.QdrantVectorStore(this.embeddings, {
                url: process.env.QDRANT_URL || "http://localhost:6333",
                collectionName: this.config.collectionName,
            });
            const results = await vectorStore.similaritySearch(query, topK);
            logger_1.logger.info("Query completed", { query: query.substring(0, 50) + "...", results: results.length });
            return results.map((result) => ({
                content: result.pageContent,
                metadata: result.metadata
            }));
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.logger.error("Error querying documents", { error: errorMessage });
            return [];
        }
    }
}
exports.DocumentProcessorService = DocumentProcessorService;
//# sourceMappingURL=DocumentProcessorService.js.map