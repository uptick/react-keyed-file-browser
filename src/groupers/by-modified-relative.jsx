import Moment from 'moment'

import GeneralUtils from 'apps/core/frontend/utils/general.jsx'

module.exports = function(files, root) {
  var timeWindows = GeneralUtils.relative_time_windows();

  for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
    var file = files[fileIndex];
    if (!file.size)
      continue;
    var newFile = {
      ...file,
      keyDerived: true,
    };

    var allocated = false;
    var fileModified = +Moment(newFile.modified);
    for (var windex = 0; windex < timeWindows.length; windex++) {
      var timeWindow = timeWindows[windex];
      if (fileModified > +timeWindow.begins && fileModified <= +timeWindow.ends) {
        timeWindow.items.push(newFile);
        allocated = true;
        break;
      }
    }
    if (!allocated) {
      var newWindow = {
        name: Moment(newFile.modified).format('MMMM YYYY'),
        begins: Moment(newFile.modified).startOf('month'),
        ends: Moment(newFile.modified).startOf('month').endOf('month'),
        items: [],
      };
      newWindow.items.push(newFile);
      timeWindows.push(newWindow);
    }
  }

  var grouped = [];
  for (var windex = 0; windex < timeWindows.length; windex++) {
    var timeWindow = timeWindows[windex];
    if (!timeWindow.items.length)
      continue;
    grouped.push({
      key: timeWindow.name.toLowerCase().replace(' ', '_'),
      name: timeWindow.name,
      children: timeWindow.items,
      size: 0,
    });
  }

  return grouped;
};
