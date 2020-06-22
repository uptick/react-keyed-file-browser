import { format, startOfMonth, endOfMonth } from 'date-fns'
import { relativeTimeWindows } from './utils'
import { isFolder } from '../utils'

export default function(files, root) {
  const timeWindows = relativeTimeWindows()

  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const file = files[fileIndex]
    if (isFolder(file)) { continue }
    const newFile = {
      ...file,
      keyDerived: true,
    }

    let allocated = false
    const fileModified = +newFile.modified
    for (let windex = 0; windex < timeWindows.length; windex++) {
      const timeWindow = timeWindows[windex]
      if (fileModified > +timeWindow.begins && fileModified <= +timeWindow.ends) {
        timeWindow.items.push(newFile)
        allocated = true
        break
      }
    }
    if (!allocated) {
      const newWindow = {
        name: format(newFile.modified, 'MMMM yyyy'),
        begins: startOfMonth(newFile.modified),
        ends: endOfMonth(newFile.modified),
        items: [],
      }
      newWindow.items.push(newFile)
      timeWindows.push(newWindow)
    }
  }

  const grouped = []
  for (let windex = 0; windex < timeWindows.length; windex++) {
    const timeWindow = timeWindows[windex]
    if (!timeWindow.items.length) { continue }
    grouped.push({
      key: `${timeWindow.name.toLowerCase().replace(' ', '_')}/`,
      name: timeWindow.name,
      children: timeWindow.items,
      size: 0,
    })
  }

  return grouped
}
