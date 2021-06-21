import { sortByDefault } from '@module/sorters'

function naturalDraftComparer(a, b) {
  if (a.draft && !b.draft) {
    return 1
  } else if (b.draft && !a.draft) {
    return -1
  }
  return sortByDefault(a, b)
}

function sortByName(allFiles) {
  let folders = []
  let files = []

  for (let fileIndex = 0; fileIndex < allFiles.length; fileIndex++) {
    const file = allFiles[fileIndex]
    const keyFolders = (file.newKey || file.key).split('/')
    if (file.children) {
      if (!file.name) {
        file.name = keyFolders[keyFolders.length - 2]
      }
      folders.push(file)
    } else {
      if (!file.name) {
        file.name = keyFolders[keyFolders.length - 1]
      }
      files.push(file)
    }
  }

  files = files.sort(sortByDefault)
  folders = folders.sort(naturalDraftComparer)

  for (let folderIndex = 0; folderIndex < folders.length; folderIndex++) {
    const folder = folders[folderIndex]
    folder.children = sortByName(folder.children)
  }

  let sortedFiles = []
  sortedFiles = sortedFiles.concat(folders)
  sortedFiles = sortedFiles.concat(files)
  return sortedFiles
}

export { sortByName }
