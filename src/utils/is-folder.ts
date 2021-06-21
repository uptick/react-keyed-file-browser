import type { FileBrowserFile } from '@module/types'

function isFolder(file: FileBrowserFile): boolean {
  return file.key.endsWith('/')
}

export { isFolder }
