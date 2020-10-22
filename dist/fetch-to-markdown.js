"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchToMarkdown = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const lodash_1 = require("lodash");
const json2yaml_1 = __importDefault(require("json2yaml"));
const fs = fs_1.promises;
const jsonToFrontmatter = (json) => `${json2yaml_1.default.stringify(json)}\n---\n`;
const addFrontmatterToPage = (item) => {
    const meta = lodash_1.omit(item, ['content']);
    return {
        ...item,
        content: jsonToFrontmatter(meta) + item.content,
    };
};
const addFrontmatterToContent = (items) => {
    const meta = items.map((item) => lodash_1.omit(item, ['content']));
    return items.map((item, i) => ({
        ...item,
        content: jsonToFrontmatter(meta[i]) + item.content,
    }));
};
const dirExists = async (dir) => !!(await fs.stat(dir).catch((_) => false));
const mkDirIfNotExists = async (dir) => (await dirExists(dir)) || (await fs.mkdir(dir));
const safeFilename = (name) => name.toLowerCase().replace(/[^a-z0-9]/gi, '_');
const titleToFilename = (title) => safeFilename(title) + '.md';
const writeFiles = async (contentPath, { items, folder }) => {
    await mkDirIfNotExists(`${contentPath}/${folder}`);
    return Promise.all(items.map(async (item) => {
        return fs.writeFile(`${contentPath}/${folder}/${titleToFilename(item.title)}`, item.content);
    }));
};
const writeFile = async (contentPath, content = '', folder) => {
    await mkDirIfNotExists(`${contentPath}/${folder}`);
    return fs.writeFile(`${contentPath}${folder ? '/' : ''}${folder}/README.md`, content);
};
const appendComponents = (item, components) => {
    return {
        ...item,
        content: `${item.content}\n${components.join('\n')}`,
    };
};
/** Fetches resource content from contentAPI and writes to markdown files */
exports.fetchToMarkdown = async (contentAPI, resource, config = {}) => {
    var _a;
    if (!contentAPI) {
        throw new Error('contentAPI is required');
    }
    else if (!resource) {
        throw new Error('resource is required');
    }
    const { components = [''], readme = '', landing = false, contentDir = 'content' } = config;
    const contentPath = path_1.default.join(path_1.default.dirname(((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) || '.'), `/${contentDir}`);
    const folder = landing === true ? '' : resource;
    const res = await node_fetch_1.default(`${contentAPI}${path_1.default}${resource}`);
    const body = await res.json();
    const content = body instanceof Array
        ? addFrontmatterToContent(body)
        : addFrontmatterToPage(body);
    const itemsWithComponents = content instanceof Array
        ? content.map((item) => appendComponents(item, components))
        : appendComponents(content, components);
    const sortedItems = itemsWithComponents instanceof Array
        ? itemsWithComponents.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
        : itemsWithComponents;
    const files = sortedItems instanceof Array
        ? await writeFiles(contentPath, { items: sortedItems, folder })
        : await writeFile(contentPath, sortedItems.content, folder);
    if (readme) {
        await writeFile(contentPath, readme, folder);
    }
    console.log(`Successfully wrote ${files ? files.length : 'page:'} ${resource}!`);
    return itemsWithComponents;
};
//# sourceMappingURL=fetch-to-markdown.js.map