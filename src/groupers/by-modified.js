import Moment from 'moment'
import {relativeTimeWindows} from './utils'

export default function(files, root) {
  const timeWindows = relativeTimeWindows()

  for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
    const file = files[fileIndex]
    if (!file.size) { continue }
    const newFile = {
      ...file,
      keyDerived: true,
    }

    let allocated = false
    const fileModified = +Moment(newFile.modified)
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
        name: Moment(newFile.modified).format('MMMM YYYY'),
        begins: Moment(newFile.modified).startOf('month'),
        ends: Moment(newFile.modified).startOf('month').endOf('month'),
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
      key: timeWindow.name.toLowerCase().replace(' ', '_'),
      name: timeWindow.name,
      children: timeWindow.items,
      size: 0,
    })
  }

  return grouped
}
