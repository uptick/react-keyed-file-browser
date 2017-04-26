export default function(files, root) {
  var fileTree = {
    contents: [],
    children: {},
  };

  files.map((file) => {
    file.relativeKey = (file.newKey || file.key).substr(root.length);
    var currentFolder = fileTree;
    var folders = file.relativeKey.split('/');
    folders.map((folder, folderIndex) => {
      if (folderIndex == folders.length - 1 && !file.size) {
        for (var key in file) {
          currentFolder[key] = file[key];
        }
      }
      if (folder == '') {
        return;
      }
      var isAFile = (file.size && (folderIndex == folders.length - 1))
      if (isAFile) {
        currentFolder.contents.push({
          ...file,
          keyDerived: true,
        });
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
    });
  });

  var add_all_children = function(level, prefix) {
    if (prefix != '') {
      prefix += '/';
    }
    var files = [];
    for (var folder in level.children) {
      files.push({
        ...level.children[folder],
        contents: undefined,
        keyDerived: true,
        key: root + prefix + folder + '/',
        relativeKey: prefix + folder + '/',
        children: add_all_children(level.children[folder], prefix + folder),
        size: 0,
      });
    }
    files = files.concat(level.contents);
    return files;
  };

  files = add_all_children(fileTree, '');
  return files;
}
