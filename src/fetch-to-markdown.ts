import {promises} from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { omit } from 'lodash'
import YAML from 'json2yaml'

type item = {
  title: string,
  content: string,
  created_at: string
}

type config = {
  components?: [string],
  readme?: string,
  landing?: boolean,
  contentDir?: string
}

const fs = promises

const jsonToFrontmatter = (json: { }) => `${YAML.stringify(json)}\n---\n`

const addFrontmatterToPage = (item: item ) => {
  const meta = omit(item, ['content'])
  return {
    ...item,
    content: jsonToFrontmatter(meta) + item.content,
  }
}
const addFrontmatterToContent = (items: Array<item>) => {
  const meta = items.map((item) => omit(item, ['content']))
  return items.map((item, i) => ({
    ...item,
    content: jsonToFrontmatter(meta[i]) + item.content,
  }))
}

const dirExists = async (dir: string) => !!(await fs.stat(dir).catch((_) => false))
const mkDirIfNotExists = async (dir: string) =>
  (await dirExists(dir)) || (await fs.mkdir(dir))
const safeFilename = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/gi, '_')
const titleToFilename = (title: string) => safeFilename(title) + '.md'

const writeFiles = async (contentPath: string, { items, folder }: {items: Array<item>, folder: string}) => {
  await mkDirIfNotExists(`${contentPath}/${folder}`)
  return Promise.all(
    items.map(async (item: item) => {
      return fs.writeFile(
        `${contentPath}/${folder}/${titleToFilename(item.title)}`,
        item.content
      )
    })
  )
}
const writeFile = async (contentPath: string, content: string = '', folder: string) => {
  await mkDirIfNotExists(`${contentPath}/${folder}`)
  return fs.writeFile(
    `${contentPath}${folder ? '/' : ''}${folder}/README.md`,
    content
  )
}

const appendComponents = (item: item, components: [string]) => {
  return {
    ...item,
    content: `${item.content}\n${components.join('\n')}`,
  }
}

/** Fetches resource content from contentAPI and writes to markdown files */
export const fetchToMarkdown = async (contentAPI: string, resource: string, config: config = { } ) => {
  if (!contentAPI) {
    throw new Error('contentAPI is required')
  } else if (!resource) {
    throw new Error('resource is required')
  }
  const  { components = [''], readme = '', landing = false, contentDir = 'content' } = config
  const contentPath = path.join(path.dirname(require?.main?.filename || '.'), `/${contentDir}`)
  const folder = landing === true ? '' : resource
  const res = await fetch(`${contentAPI}${path}${resource}`)
  const body: item | Array<item> = await res.json()
  const content =
    body instanceof Array
      ? addFrontmatterToContent(body)
      : addFrontmatterToPage(body)
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
      ? await writeFiles(contentPath, { items: sortedItems, folder })
      : await writeFile(contentPath, sortedItems.content, folder)
  if (readme) {
    await writeFile(contentPath, readme, folder)
  }
  console.log(
    `Successfully wrote ${files ? files.length : 'page:'} ${resource}!`
  )
  return itemsWithComponents
}
