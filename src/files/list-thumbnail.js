import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { formatDistanceToNow } from 'date-fns'
import flow from 'lodash/flow'

import BaseFile, { BaseFileConnectors } from './../base-file.js'
import { fileSize } from './utils.js'

class RawListThumbnailFile extends BaseFile {
  static defaultProps = {
    showName: true,
    showSize: true,
    showModified: true,
    isSelectable: true,
  }

  render() {
    const {
      thumbnail_url: thumbnailUrl, action, url,
      isDragging, isRenaming, isSelected, isSelectable, isOver, isDeleting,
      showName, showSize, showModified, browserProps, connectDragPreview,
    } = this.props

    let icon
    if (thumbnailUrl) {
      icon = (
        <div
          className="image"
          style={{
            backgroundImage: 'url(' + thumbnailUrl + ')',
          }}
        />
      )
    } else {
      icon = browserProps.icons[this.getFileType()] || browserProps.icons.File
    }

    const inAction = (isDragging || action)

    const ConfirmDeletionRenderer = browserProps.confirmDeletionRenderer

    let name
    if (showName) {
      if (!inAction && isDeleting && browserProps.selection.length === 1) {
        name = (
          <ConfirmDeletionRenderer
            handleDeleteSubmit={this.handleDeleteSubmit}
            handleFileClick={this.handleFileClick}
            url={url}
          >
            {this.getName()}
          </ConfirmDeletionRenderer>
        )
      } else if (!inAction && isRenaming) {
        name = (
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            <input
              ref={this.selectFileNameFromRef}
              type="text"
              value={this.state.newName}
              onChange={this.handleNewNameChange}
              onBlur={this.handleCancelEdit}
              autoFocus
            />
          </form>
        )
      } else {
        name = (
          <a href={url} download="download" onClick={this.handleFileClick}>
            {this.getName()}
          </a>
        )
      }
    }

    let size
    if (showSize) {
      if (!isRenaming && !isDeleting) {
        size = (
          <span className="size"><small>{fileSize(this.props.size)}</small></span>
        )
      }
    }
    let modified
    if (showModified) {
      if (!isRenaming && !isDeleting) {
        modified = (
          <span className="modified">
            Last modified: {formatDistanceToNow(this.props.modified, { addSuffix: true })}
          </span>
        )
      }
    }

    let rowProps = {}
    if (isSelectable) {
      rowProps = {
        onClick: this.handleItemClick,
      }
    }

    let row = (
      <li
        className={ClassNames('file', {
          pending: action,
          dragging: isDragging,
          dragover: isOver,
          selected: isSelected,
        })}
        onDoubleClick={this.handleItemDoubleClick}
        {...rowProps}
      >
        <div className="item">
          <span className="thumb">{icon}</span>
          <span className="name">{name}</span>
          {size}
          {modified}
        </div>
      </li>
    )
    if (typeof browserProps.moveFile === 'function') {
      row = connectDragPreview(row)
    }

    return this.connectDND(row)
  }
}

const ListThumbnailFile = flow(
  DragSource('file', BaseFileConnectors.dragSource, BaseFileConnectors.dragCollect), 
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawListThumbnailFile)

export default ListThumbnailFile
export { RawListThumbnailFile }
