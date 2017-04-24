import {
  natural_sort_comparer,
} from './utils.js'

const natural_sort = function(allFiles) {
  var folders = [];
  var files = [];

  for (var fileIndex = 0; fileIndex < allFiles.length; fileIndex++) {
    var file = allFiles[fileIndex];
    var keyFolders = (file.newKey || file.key).split('/');
    if (file.children) {
      if (!file.name) {
        file.name = keyFolders[keyFolders.length - 2];
      }
      folders.push(file);
    }
    else {
      if (!file.name) {
        file.name = keyFolders[keyFolders.length - 1];
      }
      files.push(file);
    }
  }

  files = files.sort(natural_sort_comparer);
  folders = folders.sort(natural_sort_comparer);

  for (var folderIndex = 0; folderIndex < folders.length; folderIndex++) {
    var folder = folders[folderIndex];
    folder.children = natural_sort(folder.children);
  }

  var sortedFiles = [];
  sortedFiles = sortedFiles.concat(folders);
  sortedFiles = sortedFiles.concat(files);
  return sortedFiles;
};

export default function(files) {
  return natural_sort(files);
}
