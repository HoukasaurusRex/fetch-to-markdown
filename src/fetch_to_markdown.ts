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
  landing?: string,
  path?: string
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

// @ts-ignore
const contentDir = path.join(path.dirname(require.main.filename), '/content')
const dirExists = async (dir: string) => !!(await fs.stat(dir).catch((_) => false))
const mkDirIfNotExists = async (dir: string) =>
  (await dirExists(dir)) || (await fs.mkdir(dir))
const safeFilename = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/gi, '_')
const titleToFilename = (title: string) => safeFilename(title) + '.md'

const writeFiles = async ({ items, folder }: {items: Array<item>, folder: string}) => {
  await mkDirIfNotExists(`${contentDir}/${folder}`)
  return Promise.all(
    items.map(async (item: item) => {
      return fs.writeFile(
        `${contentDir}/${folder}/${titleToFilename(item.title)}`,
        item.content
      )
    })
  )
}
const writeFile = async (content: string = '', folder: string) => {
  await mkDirIfNotExists(`${contentDir}/${folder}`)
  return fs.writeFile(
    `${contentDir}${folder ? '/' : ''}${folder}/README.md`,
    content
  )
}

const appendComponents = (item: item, components: [string]) => {
  return {
    ...item,
    content: `${item.content}\n${components.join('\n')}`,
  }
}

export const fetchToMarkdown = async (contentAPI: string, resource: string, config: config = { components: [''], readme: '', landing: 'landing', path: '/' } ) => {
  if (!contentAPI) {
    throw new Error('contentAPI is required')
  } else if (!resource) {
    throw new Error('resource is required')
  }
  const  { components = [''], readme = '', landing = 'landing', path = '/' } = config
  const folder = resource === landing ? '' : resource
  const res = await fetch(`${contentAPI}${path}${resource}`)
  const body: item | [item] = await res.json()
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
      ? await writeFiles({ items: sortedItems, folder })
      : await writeFile(sortedItems.content, folder)
  if (readme) {
    await writeFile(readme, folder)
  }
  console.log(
    `Successfully wrote ${files ? files.length : 'page:'} ${resource}!`
  )
  return itemsWithComponents
}
