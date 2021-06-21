import React, { useState } from 'react'

import { move } from '@module/utils'
import { EXTENSION } from '@module/constants'

import type {  } from '@module/types'

const BaseFile: React.FC<Props> = ({ url, newKey, fileKey, browserProps, isDragging, action, connectDragSource, connectDropTarget }) => {
  const [name, setName] = useState('')

  function getName(): string {
    let name = newKey || fileKey
    const slashIndex = name.lastIndexOf('/')

    if (slashIndex !== -1) {
      name = name.substr(slashIndex + 1)
    }

    return name
  }

  function getExtension(): string {
    const blobs = fileKey.split('.')

    return blobs[blobs.length - 1].toLowerCase().trim()
  }

  function getFileType(): string {
    return EXTENSION.TYPES[getExtension()] || 'File'
  }

  function handleFileClick(event): void {
    event && event.preventDefault()
    browserProps.preview({
      url,
      name: getName(),
      key: fileKey,
      extension: getExtension(),
    })
  }

  function handleItemClick(event): void {
    event.stopPropagation()

    browserProps.select(fileKey, 'file', event.ctrlKey || event.metaKey, event.shiftKey)
  }

  function handleItemDoubleClick(event): void {
    event.stopPropagation()
    handleFileClick(event)
  }

  function handleRenameClick(event): void {
    if (!browserProps.renameFile) {
      return
    }

    browserProps.beginAction('rename', fileKey)
  }

  function handleNewNameChange(event): void {
    setName(event.target.value)
  }

  function handleDeleteClick(event): void {
    if (!browserProps.deleteFolder) {
      return
    }

    browserProps.beginAction('delete', fileKey)
  }

  function handleDeleteSubmit(event): void {
    event.preventDefault()
    if (!browserProps.deleteFolder) {
      return
    }
    browserProps.deleteFolder(browserProps.actionTargets)
  }

  function handleCancelEdit(event): void {
    browserProps.endAction()
  }

  function toggleFolder(): void {
    browserProps.toggleFolder(fileKey)
  }

  function connectDND(render) {
    const inAction = (isDragging || action)
    if (keyDerived) {
      if (
        typeof browserProps.moveFolder === 'function' &&
        !inAction &&
        !this.props.isRenaming &&
        !this.props.isDeleting
      ) {
        render = this.props.connectDragSource(render)
      }
      if (
        typeof this.props.browserProps.createFiles === 'function' ||
        typeof this.props.browserProps.moveFolder === 'function' ||
        typeof this.props.browserProps.moveFile === 'function'
      ) {
        render = this.props.connectDropTarget(render)
      }
    }
    return render
  }
}

const dragSource = {
  beginDrag(props) {
    if (!props.browserProps.selection.length) {
      props.browserProps.select(props.fileKey, 'folder')
    }
    return {
      key: props.fileKey,
    }
  },

  endDrag(props, monitor, component) {
    move(props, monitor, component)
  },
}

function dragCollect(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

const BaseFileConnectors = {
  dragSource,
  dragCollect,
}

export { BaseFile, BaseFileConnectors }
