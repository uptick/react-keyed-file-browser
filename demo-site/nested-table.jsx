import React from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'

import FileBrowser from 'react-keyed-file-browser'

class NestedTableDemo extends React.Component {
  constructor(props) {
    super(props);

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
      ],
    };
  }

  handleAddFolder() {
    console.log('adding folder');
  }
  handleAddFile() {
    console.log('adding file');
  }
  handleMoveFolder() {
    console.log('moving folder');
  }
  handleMoveFile() {
    console.log('moving file');
  }
  handleRenameFolder() {
    console.log('renaming folder');
  }
  handleRenameFile(oldKey, newKey) {
    this.setState(state => {
      var newFiles = [];
      state.files.map((file) => {
        if (file.key === oldKey) {
          newFiles.push({
            ...file,

            key: newKey,
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
  handleDeleteFolder() {
    console.log('deleting folder');
  }
  handleDeleteFile() {
    console.log('deleting file');
  }

  render() {
    return (
      <FileBrowser
        loading={false}
        files={this.state.files}

        onAddFolder={this.handleAddFolder.bind(this)}
        onAddFile={this.handleAddFile.bind(this)}
        onMoveFolder={this.handleMoveFolder.bind(this)}
        onMoveFile={this.handleMoveFile.bind(this)}
        onRenameFolder={this.handleRenameFolder.bind(this)}
        onRenameFile={this.handleRenameFile.bind(this)}
        onDeleteFolder={this.handleDeleteFolder.bind(this)}
        onDeleteFile={this.handleDeleteFile.bind(this)}
      />
    );
  }
}

var mount = document.querySelectorAll('div.demo-mount-nested-table');
ReactDOM.render(
  <NestedTableDemo />,
  mount[0]
);
