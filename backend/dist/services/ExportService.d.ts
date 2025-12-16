import { ExportFormatId } from '../models/ExportFormat';
export interface ExportResult {
    downloadUrl: string;
    format: ExportFormatId;
    fileSize: number;
    createdAt: Date;
}
export declare class ExportService {
    exportBook(bookId: string, format: ExportFormatId): Promise<ExportResult>;
    private convertToFormat;
    private toPdfFormat;
    private toHtmlFormat;
    private toMarkdownFormat;
    private isValidFormat;
    getAvailableFormats(): ExportFormatId[];
}
//# sourceMappingURL=ExportService.d.ts.map