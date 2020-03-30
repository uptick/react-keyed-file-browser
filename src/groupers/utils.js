// @ts-nocheck
import Moment from 'moment'

function relativeTimeWindows() {
  const windows = []
  const now = Moment()
  windows.push({
    name: 'Today',
    begins: Moment().startOf('day'),
    ends: Moment().endOf('day'),
    items: [],
  })
  windows.push({
    name: 'Yesterday',
    begins: Moment(windows[windows.length - 1].begins - Moment.duration(24, 'hours')),
    ends: Moment(windows[windows.length - 1].ends - Moment.duration(24, 'hours')),
    items: [],
  })
  windows.push({
    name: 'Earlier this Week',
    begins: windows[0].begins.clone().startOf('week'),
    ends: windows[0].begins.clone().startOf('week').endOf('week'),
    items: [],
  })
  windows.push({
    name: 'Last Week',
    begins: Moment(windows[2].begins - Moment.duration(7, 'days')),
    ends: Moment(windows[2].begins - Moment.duration(7, 'days')).endOf('week'),
    items: [],
  })
  if (Moment(windows[windows.length - 1].begins).month() === now.month()) {
    windows.push({
      name: 'Earlier this Month',
      begins: Moment().startOf('month'),
      ends: Moment().startOf('month').endOf('month'),
      items: [],
    })
  }
  return windows
}

export { relativeTimeWindows }
