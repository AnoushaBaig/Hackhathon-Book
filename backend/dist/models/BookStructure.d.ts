export interface BookStructure {
    title: string;
    level: number;
    content: string;
    children: BookStructure[];
    type: 'chapter' | 'section' | 'subsection' | 'appendix';
}
export declare const validateBookStructure: (structure: BookStructure) => string[];
export declare const createBookStructure: (input: Omit<BookStructure, "children"> & {
    children?: BookStructure[];
}) => BookStructure;
export declare const defaultBookStructures: BookStructure[];
//# sourceMappingURL=BookStructure.d.ts.map