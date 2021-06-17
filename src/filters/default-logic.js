export const DefaultFilterLogic = (nameFilter, files) => {
  const filteredFiles = []
  const terms = nameFilter.toLowerCase().split(' ')
  files.map((file) => {
    let skip = false
    terms.map((term) => {
      if (file.key.toLowerCase().trim().indexOf(term) === -1) {
        skip = true
      }
    })
    if (skip) {
      return
    }
    filteredFiles.push(file)
  })

  return filteredFiles
}
