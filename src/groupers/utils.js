// @ts-nocheck
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
import { getIntl } from '../browser'

function relativeTimeWindows() {
  const windows = []
  const now = new Date()
  windows.push({
    name: getIntl('Today'),
    begins: startOfToday(),
    ends: endOfToday(),
    items: [],
  })
  windows.push({
    name: getIntl('Yesterday'),
    begins: startOfYesterday(),
    ends: endOfYesterday(),
    items: [],
  })
  windows.push({
    name: getIntl('Earlier This Week'),
    begins: startOfWeek(now),
    ends: endOfWeek(now),
    items: [],
  })
  windows.push({
    name: getIntl('Last Week'),
    begins: startOfWeek(addWeeks(now, -1)),
    ends: endOfWeek(addWeeks(now, -1)),
    items: [],
  })
  if (getMonth(windows[windows.length - 1].begins) === getMonth(now)) {
    windows.push({
      name: getIntl('Earlier This Month'),
      begins: startOfMonth(now),
      ends: endOfMonth(now),
      items: [],
    })
  }
  return windows
}

export { relativeTimeWindows }
