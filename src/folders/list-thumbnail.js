import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import flow from 'lodash/flow'

import BaseFolder, { BaseFolderConnectors } from './../base-folder.js'
import { BaseFileConnectors } from './../base-file.js'

import { isFolder } from '../utils'

class RawListThumbnailFolder extends BaseFolder {
  render() {
    const {
      isOpen, isDragging, isDeleting, isRenaming, isDraft, isOver, isSelected,
      url, action, browserProps, depth, keyDerived, connectDragPreview,
    } = this.props

    const icon = browserProps.icons[isOpen ? 'FolderOpen' : 'Folder']

    const inAction = (isDragging || action)

    const ConfirmDeletionRenderer = browserProps.confirmDeletionRenderer

    let name
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
    } else if ((!inAction && isRenaming) || isDraft) {
      name = (
        <div>
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            <input
              type="text"
              ref={this.selectFolderNameFromRef}
              value={this.state.newName}
              onChange={this.handleNewNameChange}
              onBlur={this.handleCancelEdit}
              autoFocus
            />
          </form>
        </div>
      )
    } else {
      name = (
        <div>
          <a onClick={this.toggleFolder}>
            {this.getName()}
          </a>
        </div>
      )
    }

    let children
    if (isOpen && browserProps.nestChildren) {
      children = []
      for (let childIndex = 0; childIndex < children.length; childIndex++) {
        const file = children[childIndex]

        const thisItemProps = {
          ...browserProps.getItemProps(file, browserProps),
          depth: depth + 1,
        }

        if (!isFolder(file)) {
          children.push(
            <browserProps.fileRenderer
              {...file}
              {...thisItemProps}
              browserProps={browserProps}
              {...browserProps.fileRendererProps}
            />
          )
        } else {
          children.push(
            <browserProps.folderRenderer
              {...file}
              {...thisItemProps}
              browserProps={browserProps}
              {...browserProps.folderRendererProps}
            />
          )
        }
      }
      if (children.length) {
        children = (<ul style={{ padding: '0 8px', paddingLeft: '16px' }}>{children}</ul>)
      } else {
        children = (<p>No items in this folder</p>)
      }
    }

    let folder = (
      <li
        className={ClassNames('folder', {
          expanded: isOpen && browserProps.nestChildren,
          pending: action,
          dragging: isDragging,
          dragover: isOver,
          selected: isSelected,
        })}
        onClick={this.handleFolderClick}
        onDoubleClick={this.handleFolderDoubleClick}
      >
        <div className="item">
          <span className="thumb">{icon}</span>
          <span className="name">{name}</span>
        </div>
        {children}
      </li>
    )
    if (typeof browserProps.moveFolder === 'function' && keyDerived) {
      folder = connectDragPreview(folder)
    }

    return this.connectDND(folder)
  }
}

const ListThumbnailFolder = flow(
  DragSource('folder', BaseFolderConnectors.dragSource, BaseFolderConnectors.dragCollect), 
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawListThumbnailFolder)

export default ListThumbnailFolder
export { RawListThumbnailFolder }
