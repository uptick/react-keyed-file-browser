// @ts-nocheck
import PropTypes from 'prop-types'
import React from 'react'
import { moveFilesAndFolders } from './utils'
import { extensionMapping } from './constants.js'

class BaseFile extends React.Component {
  static propTypes = {
    fileKey: PropTypes.string,
    url: PropTypes.string,

    newKey: PropTypes.string,
    isRenaming: PropTypes.bool,

    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    isDragging: PropTypes.bool,
    action: PropTypes.string,

    browserProps: PropTypes.shape({
      icons: PropTypes.object,
      select: PropTypes.func,
      beginAction: PropTypes.func,
      endAction: PropTypes.func,
      preview: PropTypes.func,

      createFiles: PropTypes.func,
      moveFile: PropTypes.func,
      moveFolder: PropTypes.func,
      renameFile: PropTypes.func,
      deleteFile: PropTypes.func,
    }),
  }

  state = {
    newName: this.getName(),
  }

  selectFileNameFromRef(element) {
    if (element) {
      const currentName = element.value
      const pointIndex = currentName.lastIndexOf('.')
      element.setSelectionRange(0, pointIndex || currentName.length)
      element.focus()
    }
  }

  getName() {
    let name = this.props.newKey || this.props.fileKey
    const slashIndex = name.lastIndexOf('/')
    if (slashIndex !== -1) {
      name = name.substr(slashIndex + 1)
    }
    return name
  }
  getExtension() {
    const blobs = this.props.fileKey.split('.')
    return blobs[blobs.length - 1].toLowerCase().trim()
  }

  getFileType() {
    return extensionMapping[this.getExtension()] || 'File'
  }

  handleFileClick = (event) => {
    event && event.preventDefault()
    this.props.browserProps.preview({
      url: this.props.url,
      name: this.getName(),
      key: this.props.fileKey,
      extension: this.getExtension(),
    })
  }
  handleItemClick = (event) => {
    event.stopPropagation()
    this.props.browserProps.select(this.props.fileKey, 'file', event.ctrlKey || event.metaKey, event.shiftKey)
  }
  handleItemDoubleClick = (event) => {
    event.stopPropagation()
    this.handleFileClick()
  }

  handleRenameClick = (event) => {
    if (!this.props.browserProps.renameFile) {
      return
    }
    this.props.browserProps.beginAction('rename', this.props.fileKey)
  }
  handleNewNameChange = (event) => {
    const newName = event.target.value
    this.setState({ newName: newName })
  }
  handleRenameSubmit = (event) => {
    if (event) {
      event.preventDefault()
    }
    if (!this.props.browserProps.renameFile) {
      return
    }
    const newName = this.state.newName.trim()
    if (newName.length === 0) {
      // todo: move to props handler
      // window.notify({
      //   style: 'error',
      //   title: 'Invalid new file name',
      //   body: 'File name cannot be blank',
      // })
      return
    }
    const invalidChar = ['/', '\\']
    if (invalidChar.some(char => newName.indexOf(char) !== -1)) return
    // todo: move to props handler
    // window.notify({
    //   style: 'error',
    //   title: 'Invalid new file name',
    //   body: 'File names cannot contain forward slashes.',
    // })
    let newKey = newName
    const slashIndex = this.props.fileKey.lastIndexOf('/')
    if (slashIndex !== -1) {
      newKey = `${this.props.fileKey.substr(0, slashIndex)}/${newName}`
    }
    this.props.browserProps.renameFile(this.props.fileKey, newKey)
  }

  handleDeleteClick = (event) => {
    if (!this.props.browserProps.deleteFile) {
      return
    }
    this.props.browserProps.beginAction('delete', this.props.fileKey)
  }
  handleDeleteSubmit = (event) => {
    event.preventDefault()
    if (!this.props.browserProps.deleteFile) {
      return
    }

    this.props.browserProps.deleteFile(this.props.browserProps.actionTargets)
  }

  handleCancelEdit = (event) => {
    this.props.browserProps.endAction()
  }

  connectDND(render) {
    const inAction = (this.props.isDragging || this.props.action)
    if (
      typeof this.props.browserProps.moveFile === 'function' &&
      !inAction &&
      !this.props.isRenaming
    ) {
      render = this.props.connectDragSource(render)
    }
    if (
      typeof this.props.browserProps.createFiles === 'function' ||
      typeof this.props.browserProps.moveFile === 'function' ||
      typeof this.props.browserProps.moveFolder === 'function'
    ) {
      render = this.props.connectDropTarget(render)
    }
    return render
  }
}

const dragSource = {
  beginDrag(props) {
    if (
      !props.browserProps.selection.length ||
      !props.browserProps.selection.includes(props.fileKey)
    ) {
      props.browserProps.select(props.fileKey, 'file')
    }
    return {
      key: props.fileKey,
    }
  },

  endDrag(props, monitor, component) {
    moveFilesAndFolders(props, monitor, component)
  },
}

function dragCollect(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

const targetSource = {
  drop(props, monitor) {
    if (monitor.didDrop()) {
      return
    }
    const key = props.newKey || props.fileKey
    const slashIndex = key.lastIndexOf('/')
    const path = (slashIndex !== -1) ? key.substr(0, slashIndex + 1) : ''
    const item = monitor.getItem()
    if (item.files && props.browserProps.createFiles) {
      props.browserProps.createFiles(item.files, path)
    }
    return {
      path: path,
    }
  },
}

function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  }
}

const BaseFileConnectors = {
  dragSource,
  dragCollect,
  targetSource,
  targetCollect,
}

export default BaseFile
export {
  BaseFileConnectors,
}
