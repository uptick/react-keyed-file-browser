import React from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'

import FileBrowser from 'react-keyed-file-browser'

class NestedEditableDemo extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddFolder = ::this.handleAddFolder;
    this.handleAddFile = ::this.handleAddFile;
    this.handleRenameFolder = ::this.handleRenameFolder;
    this.handleRenameFile = ::this.handleRenameFile;
    this.handleDeleteFolder = ::this.handleDeleteFolder;
    this.handleDeleteFile = ::this.handleDeleteFile;

    this.state = {
      ...this.state,

      files: [
        {
          key: 'photos/animals/cat in a hat.png',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'photos/animals/kitten_ball.png',
          modified: +Moment().subtract(3, 'days'),
          size: 545 * 1024,
        },
        {
          key: 'photos/animals/elephants.png',
          modified: +Moment().subtract(3, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'photos/funny fall.gif',
          modified: +Moment().subtract(2, 'months'),
          size: 13.2 * 1024 * 1024,
        },
        {
          key: 'photos/holiday.jpg',
          modified: +Moment().subtract(25, 'days'),
          size: 85 * 1024,
        },
        {
          key: 'documents/letter chunks.doc',
          modified: +Moment().subtract(15, 'days'),
          size: 480 * 1024,
        },
        {
          key: 'documents/export.pdf',
          modified: +Moment().subtract(15, 'days'),
          size: 4.2 * 1024 * 1024,
        },
      ],
    };
  }

  handleAddFolder() {
    console.log('adding folder');
  }
  handleAddFile() {
    console.log('adding file');
  }
  handleRenameFolder(oldKey, newKey) {
    console.log('renaming folder', oldKey, 'to', newKey);
    this.setState(state => {
      var newFiles = [];
      state.files.map((file) => {
        if (file.key.substr(0, oldKey.length) === oldKey) {
          newFiles.push({
            ...file,
            key: file.key.replace(oldKey, newKey),
            modified: +Moment(),
          });
        }
        else {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  }
  handleRenameFile(oldKey, newKey) {
    console.log('renaming file', oldKey, 'to', newKey);
    this.setState(state => {
      var newFiles = [];
      state.files.map((file) => {
        if (file.key === oldKey) {
          newFiles.push({
            ...file,
            key: newKey,
            modified: +Moment(),
          });
        }
        else {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  }
  handleDeleteFolder(folderKey) {
    this.setState(state => {
      var newFiles = [];
      state.files.map((file) => {
        if (file.key.substr(0, folderKey.length) !== folderKey) {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  }
  handleDeleteFile(fileKey) {
    this.setState(state => {
      var newFiles = [];
      state.files.map((file) => {
        if (file.key !== fileKey) {
          newFiles.push(file);
        }
      });
      state.files = newFiles;
      return state;
    });
  }

  render() {
    return (
      <FileBrowser
        files={this.state.files}

        onAddFolder={this.handleAddFolder}
        onAddFile={this.handleAddFile}
        onMoveFolder={this.handleRenameFolder}
        onMoveFile={this.handleRenameFile}
        onRenameFolder={this.handleRenameFolder}
        onRenameFile={this.handleRenameFile}
        onDeleteFolder={this.handleDeleteFolder}
        onDeleteFile={this.handleDeleteFile}
      />
    );
  }
}

var mount = document.querySelectorAll('div.demo-mount-nested-editable');
ReactDOM.render(
  <NestedEditableDemo />,
  mount[0]
);
