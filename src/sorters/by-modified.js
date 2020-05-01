import { compareAsc } from 'date-fns'

function lastModifiedSort(allFiles) {
  const folders = []
  let files = []
  for (let fileIndex = 0; fileIndex < allFiles.length; fileIndex++) {
    const file = allFiles[fileIndex]
    const keyFolders = (file.newKey || file.key).split('/')
    if (file.children) {
      // file.name = keyFolders[keyFolders.length - 2]
      folders.push(file)
    } else {
      file.name = keyFolders[keyFolders.length - 1]
      files.push(file)
    }
  }

  files = files.sort(compareAsc)

  for (let folderIndex = 0; folderIndex < folders.length; folderIndex++) {
    const folder = folders[folderIndex]
    folder.children = lastModifiedSort(folder.children)
  }

  let sortedFiles = []
  sortedFiles = sortedFiles.concat(folders)
  sortedFiles = sortedFiles.concat(files)
  return sortedFiles
}

export default function(files) {
  return lastModifiedSort(files)
}
