declare type frontmatter = {};
declare type components = Array<string>;
declare type config = {
    components?: components;
    readme?: string;
    contentDir?: string;
    queryParams?: string;
    frontmatter?: frontmatter;
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
