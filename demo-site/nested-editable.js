import React from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'

import FileBrowser, {Icons} from 'react-keyed-file-browser'

class NestedEditableDemo extends React.Component {
  state = {
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
  }

  handleCreateFolder = (key) => {
    this.setState(state => {
      state.files = state.files.concat([{
        key: key,
      }])
      return state
    })
  }
  handleCreateFiles = (files, prefix) => {
    this.setState(prevState => {
      const newFiles = files.map((file) => {
        let newKey = prefix
        if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
          newKey += '/'
        }
        const invalidChar = ['/', '\\']
        if (invalidChar.some(char => file.name.indexOf(char) !== -1)) return
        newKey += file.name
        return {
          key: newKey,
          size: file.size,
          modified: +Moment(),
        }
      })
      const uniqueNewFiles = []
      newFiles.forEach((newFile) => {
        const exists = prevState.files.some(existingFile => (existingFile.key === newFile.key))
        if (!exists) uniqueNewFiles.push(newFile)
      })
      const updatedFiles = [...prevState.files, uniqueNewFiles]
      return { files: updatedFiles }
    })
  }
  handleRenameFolder = (oldKey, newKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key.substr(0, oldKey.length) === oldKey) {
          newFiles.push({
            ...file,
            key: file.key.replace(oldKey, newKey),
            modified: +Moment(),
          })
        } else {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
  }
  handleRenameFile = (oldKey, newKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key === oldKey) {
          newFiles.push({
            ...file,
            key: newKey,
            modified: +Moment(),
          })
        } else {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
  }
  handleDeleteFolder = (folderKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key.substr(0, folderKey.length) !== folderKey) {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
  }
  handleDeleteFile = (fileKey) => {
    this.setState(state => {
      const newFiles = []
      state.files.map((file) => {
        if (file.key !== fileKey) {
          newFiles.push(file)
        }
      })
      state.files = newFiles
      return state
    })
  }

  render() {
    return (
      <FileBrowser
        files={this.state.files}
        icons={Icons.FontAwesome(4)}

        onCreateFolder={this.handleCreateFolder}
        onCreateFiles={this.handleCreateFiles}
        onMoveFolder={this.handleRenameFolder}
        onMoveFile={this.handleRenameFile}
        onRenameFolder={this.handleRenameFolder}
        onRenameFile={this.handleRenameFile}
        onDeleteFolder={this.handleDeleteFolder}
        onDeleteFile={this.handleDeleteFile}
      />
    )
  }
}

const mount = document.querySelectorAll('div.demo-mount-nested-editable')
ReactDOM.render(
  <NestedEditableDemo />,
  mount[0]
)
