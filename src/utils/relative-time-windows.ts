import {
  startOfToday,
  endOfToday,
  startOfYesterday,
  endOfYesterday,
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  getMonth,
} from 'date-fns'

import type { FileBrowserWindow } from '@module/types'

function relativeTimeWindows() {
  const windows: FileBrowserWindow[] = []
  const now = new Date()

  windows.push({
    name: 'Today',
    begins: startOfToday(),
    ends: endOfToday(),
    items: [],
  })

  windows.push({
    name: 'Yesterday',
    begins: startOfYesterday(),
    ends: endOfYesterday(),
    items: [],
  })

  windows.push({
    name: 'Earlier this Week',
    begins: startOfWeek(now),
    ends: endOfWeek(now),
    items: [],
  })

  windows.push({
    name: 'Last Week',
    begins: startOfWeek(addWeeks(now, -1)),
    ends: endOfWeek(addWeeks(now, -1)),
    items: [],
  })

  if (getMonth(windows[windows.length - 1].begins) === getMonth(now)) {
    windows.push({
      name: 'Earlier this Month',
      begins: startOfMonth(now),
      ends: endOfMonth(now),
      items: [],
    })
  }

  return windows
}

export { relativeTimeWindows }
