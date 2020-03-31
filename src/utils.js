function isFolder(file) {
  return file.key.endsWith('/')
}

function moveFilesAndFolders(props, monitor, component) {
  if (!monitor.didDrop()) {
    return
  }

  const dropResult = monitor.getDropResult()

  const folders = []
  const files = []

  props.browserProps.selection.forEach(selection => {
    selection[selection.length - 1] === '/' ? folders.push(selection) : files.push(selection)
  })

  props.browserProps.openFolder(dropResult.path)

  folders
    .forEach(selection => {
      const fileKey = selection
      const fileNameParts = fileKey.split('/')
      const folderName = fileNameParts[fileNameParts.length - 2]

      const newKey = `${dropResult.path}${folderName}/`
      // abort if the new folder name contains itself
      if (newKey.substr(0, fileKey.length) === fileKey) return

      if (newKey !== fileKey && props.browserProps.moveFolder) {
        props.browserProps.moveFolder(fileKey, newKey)
      }
    })

  files
    .forEach(selection => {
      const fileKey = selection
      const fileNameParts = fileKey.split('/')
      const fileName = fileNameParts[fileNameParts.length - 1]
      const newKey = `${dropResult.path}${fileName}`
      if (newKey !== fileKey && props.browserProps.moveFile) {
        props.browserProps.moveFile(fileKey, newKey)
      }
    })
}

export { isFolder, moveFilesAndFolders }
