module.exports = function(files, root) {
  var fileTree = {
    contents: [],
    children: {},
  };

  for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
    var file = files[fileIndex];
    file.relativeKey = (file.newKey || file.key).substr(root.length);
    var currentFolder = fileTree;
    var folders = file.relativeKey.split('/');
    for (var folderIndex = 0; folderIndex < folders.length; folderIndex++) {
      var folder = folders[folderIndex];
      if (folder == '')
        continue;
      var isAFile = (file.size && (folderIndex == folders.length - 1))
      if (isAFile) {
        var newFile = {
          ...file,
          keyDerived: true,
        };
        currentFolder.contents.push(newFile);
      }
      else {
        if (folder in currentFolder.children == false) {
          currentFolder.children[folder] = {
            contents: [],
            children: {},
          }
        }
        currentFolder = currentFolder.children[folder];
      }
    }
  }

  var add_all_children = function(level, prefix) {
    if (prefix != '')
      prefix += '/';
    var files = [];
    for (var folder in level.children)
      files.push({
        keyDerived: true,
        key: root + prefix + folder + '/',
        relativeKey: prefix + folder + '/',
        children: add_all_children(level.children[folder], prefix + folder),
        size: 0,
      });
    files = files.concat(level.contents);
    return files;
  };

  var files = add_all_children(fileTree, '');
  return files;
};
