import { promises } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { omit } from 'lodash';
import YAML from 'json2yaml';
const fs = promises;
const jsonToFrontmatter = (json, frontmatter) => `${YAML.stringify({ ...json, ...frontmatter })}\n---\n`;
const addFrontmatterToPage = (item, frontmatter) => {
    const meta = omit(item, ['content']);
    return {
        ...item,
        content: jsonToFrontmatter(meta, frontmatter) + item.content,
    };
};
const addFrontmatterToContent = (items, frontmatter) => {
    const meta = items.map((item) => omit(item, ['content']));
    return items.map((item, i) => ({
        ...item,
        content: jsonToFrontmatter(meta[i], frontmatter) + item.content,
    }));
};
const dirExists = async (dir) => !!(await fs.stat(dir).catch((_) => false));
const mkDirIfNotExists = async (dir) => (await dirExists(dir)) || (await fs.mkdir(dir));
const safeFilename = (name) => name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
const titleToFilename = (title) => safeFilename(title) + '.md';
const writeFiles = async (dir, items) => {
    await fs.rmdir(dir, { recursive: true });
    await fs.mkdir(dir);
    return Promise.all(items.map(async (item) => {
        return fs.writeFile(`${dir}/${titleToFilename(item.title)}`, item.content);
    }));
};
const writeFile = async (dir, content = '') => {
    await mkDirIfNotExists(dir);
    return fs.writeFile(`${dir}/README.md`, content);
};
const appendComponents = (item, components) => {
    return {
        ...item,
        content: `${item.content}\n${components.join('\n')}`,
    };
};
/** Fetches resource content from contentAPI and writes to markdown files */
export const fetchToMarkdown = async (contentAPI, resource, config = {}) => {
    var _a;
    const { components = [''], readme = '', contentDir = '', queryParams = '' } = config;
    if (!contentAPI)
        throw new Error('contentAPI is required');
    if (!resource)
        throw new Error('resource is required');
    const res = await fetch(`${contentAPI}/${resource}${queryParams}`);
    const dir = contentDir || path.join(((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) || __dirname, resource);
    const body = await res.json();
    const content = body instanceof Array
        ? addFrontmatterToContent(body, config.frontmatter || {})
        : addFrontmatterToPage(body, config.frontmatter || {});
    const itemsWithComponents = content instanceof Array
        ? content.map((item) => appendComponents(item, components))
        : appendComponents(content, components);
    const sortedItems = itemsWithComponents instanceof Array
        ? itemsWithComponents.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
        : itemsWithComponents;
    const files = sortedItems instanceof Array
        ? await writeFiles(dir, sortedItems)
        : await writeFile(dir, sortedItems.content);
    if (readme) {
        await writeFile(dir, readme);
    }
    console.log(`Successfully wrote ${files ? files.length : 'page:'} ${resource}!`);
    return itemsWithComponents;
};
//# sourceMappingURL=fetch-to-markdown.js.map