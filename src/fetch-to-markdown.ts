import { promises } from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { omit } from 'lodash'
import YAML from 'json2yaml'

type item = {
  title: string,
  content: string,
  created_at: string
}

type frontmatter = {

}

type components = Array<string>

type config = {
  components?: components,
  readme?: string,
  contentDir?: string,
  queryParams?: string,
  frontmatter?: frontmatter
}


const fs = promises

const jsonToFrontmatter = (json: { }, frontmatter: frontmatter) => `${YAML.stringify({...json, ...frontmatter})}\n---\n`

const addFrontmatterToPage = (item: item, frontmatter: frontmatter ) => {
  const meta = omit(item, ['content'])
  return {
    ...item,
    content: jsonToFrontmatter(meta, frontmatter) + item.content,
  }
}
const addFrontmatterToContent = (items: Array<item>, frontmatter: frontmatter) => {
  const meta = items.map((item) => omit(item, ['content']))
  return items.map((item, i) => ({
    ...item,
    content: jsonToFrontmatter(meta[i], frontmatter) + item.content,
  }))
}

const dirExists = async (dir: string) => !!(await fs.stat(dir).catch((_) => false))
const mkDirIfNotExists = async (dir: string) =>
  (await dirExists(dir)) || (await fs.mkdir(dir))
const safeFilename = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/gi, '-')
const titleToFilename = (title: string) => safeFilename(title) + '.md'

const writeFiles = async (dir: string, items: Array<item>) => {
  await mkDirIfNotExists(dir)
  return Promise.all(
    items.map(async (item: item) => {
      return fs.writeFile(
        `${dir}/${titleToFilename(item.title)}`,
        item.content
      )
    })
  )
}
const writeFile = async (dir: string, content: string = '') => {
  await mkDirIfNotExists(dir)
  return fs.writeFile(
    `${dir}/README.md`,
    content
  )
}

const appendComponents = (item: item, components: components) => {
  return {
    ...item,
    content: `${item.content}\n${components.join('\n')}`,
  }
}

/** Fetches resource content from contentAPI and writes to markdown files */
export const fetchToMarkdown = async (contentAPI: string, resource: string, config: config = { } ) => {
  const  { components = [''], readme = '', contentDir = '', queryParams = '' } = config
  if (!contentAPI) {
    throw new Error('contentAPI is required')
  } else if (!resource) {
    throw new Error('resource is required')
  }
  const res = await fetch(`${contentAPI}/${resource}${queryParams}`)
  const dir = contentDir || path.join(require?.main?.filename || __dirname, resource)
  const body: item | Array<item> = await res.json()
  const content =
    body instanceof Array
      ? addFrontmatterToContent(body, config.frontmatter || {})
      : addFrontmatterToPage(body, config.frontmatter || {})
  const itemsWithComponents =
    content instanceof Array
      ? content.map((item) => appendComponents(item, components))
      : appendComponents(content, components)
  const sortedItems =
    itemsWithComponents instanceof Array
      ? itemsWithComponents.sort(
          (a: item, b: item) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
        )
      : itemsWithComponents
  const files =
    sortedItems instanceof Array
      ? await writeFiles(dir, sortedItems)
      : await writeFile(dir, sortedItems.content)
  if (readme) {
    await writeFile(dir, readme)
  }
  console.log(
    `Successfully wrote ${files ? files.length : 'page:'} ${resource}!`
  )
  return itemsWithComponents
}
