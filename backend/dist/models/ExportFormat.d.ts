export interface ExportFormat {
    id: ExportFormatId;
    name: string;
    description: string;
    mimeType: string;
    supportedFeatures: string[];
}
export type ExportFormatId = 'pdf' | 'html' | 'markdown';
export declare const validateExportFormat: (format: Partial<ExportFormat>) => string[];
export declare const createExportFormat: (input: Omit<ExportFormat, "id"> & {
    id: ExportFormatId;
}) => ExportFormat;
export declare const defaultExportFormats: ExportFormat[];
//# sourceMappingURL=ExportFormat.d.ts.map