import Moment from 'moment'

import { natural_sort_comparer } from './utils.jsx'

const last_modified_comparer = function (a, b) {
  return (+Moment(a.modified) < +Moment(b.modified));
};

const last_modified_sort = function(allFiles) {
  var folders = [];
  var files = [];
  for (var fileIndex = 0; fileIndex < allFiles.length; fileIndex++) {
    var file = allFiles[fileIndex];
    var keyFolders = (file.newKey || file.key).split('/');
    if (file.children) {
      // file.name = keyFolders[keyFolders.length - 2];
      folders.push(file);
    }
    else {
      file.name = keyFolders[keyFolders.length - 1];
      files.push(file);
    }
  }

  files = files.sort(last_modified_comparer);

  for (var folderIndex = 0; folderIndex < folders.length; folderIndex++) {
    var folder = folders[folderIndex];
    folder.children = last_modified_sort(folder.children);
  }

  var sortedFiles = [];
  sortedFiles = sortedFiles.concat(folders);
  sortedFiles = sortedFiles.concat(files);
  return sortedFiles;
};

module.exports = function(files) {
  return last_modified_sort(files);
};
