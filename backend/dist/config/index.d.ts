export interface Config {
    port: number;
    gemini?: {
        apiKey: string;
    };
    openai?: {
        apiKey: string;
    };
    frontend: {
        port: number;
    };
    server: {
        url: string;
    };
}
declare const config: Config;
export default config;
//# sourceMappingURL=index.d.ts.map