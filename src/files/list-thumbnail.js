import React from 'react'
import Moment from 'moment'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import BaseFile, { BaseFileConnectors } from './../base-file.js'
import { fileSize } from './utils.js'

@DragSource('file', BaseFileConnectors.dragSource, BaseFileConnectors.dragCollect)
@DropTarget(
  ['file', 'folder', NativeTypes.FILE],
  BaseFileConnectors.targetSource,
  BaseFileConnectors.targetCollect,
)
class ListFile extends BaseFile {
  static defaultProps = {
    showName: true,
    showSize: true,
    showModified: true,
    isSelectable: true,
  }

  render() {
    let icon
    if (this.isImage()) {
      if (this.props.thumbnail_url) {
        icon = (
          <div className="image" style={{
            backgroundImage: 'url(' + this.props.thumbnail_url + ')',
          }} />
        )
      } else {
        icon = (<i className="fa fa-file-image-o" aria-hidden="true" />)
      }
    } else if (this.isPdf()) {
      icon = (<i className="fa fa-file-pdf-o" aria-hidden="true" />)
    } else {
      icon = (<i className="fa fa-file-o" aria-hidden="true" />)
    }

    const inAction = (this.props.isDragging || this.props.action)

    let name
    if (this.props.showName) {
      if (!inAction && this.props.isDeleting) {
        name = (
          <form className="deleting" onSubmit={this.handleDeleteSubmit}>
            <a
              href={this.props.url}
              download="download"
              onClick={this.handleFileClick}
            >
              {this.getName()}
            </a>
            <div>
              <a
                className="cancel"
                onClick={this.handleCancelEdit}
              >
                Cancel
              </a>
              <button type="submit">
                Confirm Deletion
              </button>
            </div>
          </form>
        )
      } else if (!inAction && this.props.isRenaming) {
        name = (
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            <input
              ref="newName"
              type="text"
              value={this.state.newName}
              onChange={this.handleNewNameChange}
              onBlur={this.handleCancelEdit}
            />
            <a
              className="cancel"
              onClick={this.handleCancelEdit}
            >
              Cancel
            </a>
          </form>
        )
      } else {
        name = (
          <a href={this.props.url} download="download" onClick={this.handleFileClick}>
            {this.getName()}
          </a>
        )
      }
    }

    let size
    if (this.props.showSize) {
      if (!this.props.isRenaming && !this.props.isDeleting) {
        size = (
          <span className="size"><small>{fileSize(this.props.size)}</small></span>
        )
      }
    }
    let modified
    if (this.props.showModified) {
      if (!this.props.isRenaming && !this.props.isDeleting) {
        modified = (
          <span className="modified">
            Last modified: {Moment(this.props.modified).fromNow()}
          </span>
        )
      }
    }

    let rowProps = {}
    if (this.props.isSelectable) {
      rowProps = {
        onClick: this.handleItemClick,
      }
    }

    let row = (
      <li
        className={ClassNames('file', {
          pending: (this.props.action),
          dragging: (this.props.isDragging),
          dragover: (this.props.isOver),
          selected: (this.props.isSelected),
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
    if (this.props.browserProps.canMoveFiles) {
      row = this.props.connectDragPreview(row)
    }

    return this.connectDND(row)
  }
}

export default ListFile
