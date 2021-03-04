declare type config = {
    components?: [string];
    readme?: string;
    contentDir?: string;
    queryParams?: string;
};
/** Fetches resource content from contentAPI and writes to markdown files */
export declare const fetchToMarkdown: (contentAPI: string, resource: string, config?: config) => Promise<{
    content: string;
    title: string;
    created_at: string;
} | {
    content: string;
    title: string;
    created_at: string;
}[]>;
export {};
