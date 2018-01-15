import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import BaseFolder, { BaseFolderConnectors } from './../base-folder.js'
import { BaseFileConnectors } from './../base-file.js'

@DragSource('folder', BaseFolderConnectors.dragSource, BaseFolderConnectors.dragCollect)
@DropTarget(
  ['file', 'folder', NativeTypes.FILE],
  BaseFileConnectors.targetSource,
  BaseFileConnectors.targetCollect,
)
class ListThumbnailFolder extends BaseFolder {
  render() {
    const icon = (<i className={`fa fa-folder${this.props.isOpen ? '-open' : ''}-o`} aria-hidden="true" />)

    const inAction = (this.props.isDragging || this.props.action)

    let name
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
            <button type="submit">
              Confirm Deletion
            </button>
          </div>
        </form>
      )
    } else if ((!inAction && this.props.isRenaming) || this.props.isDraft) {
      name = (
        <div>
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            <input
              type="text"
              ref="newName"
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
    if (this.props.isOpen && this.props.browserProps.nestChildren) {
      children = []
      for (let childIndex = 0; childIndex < this.props.children.length; childIndex++) {
        const file = this.props.children[childIndex]

        const thisItemProps = {
          ...this.props.browserProps.getItemProps(file, this.props.browserProps),
          depth: this.props.depth + 1,
        }

        if (file.size) {
          children.push(
            <this.props.browserProps.fileRenderer
              {...file}
              {...thisItemProps}
              browserProps={this.props.browserProps}
              {...this.props.browserProps.fileRendererProps}
            />
          )
        } else {
          children.push(
            <this.props.browserProps.folderRenderer
              {...file}
              {...thisItemProps}
              browserProps={this.props.browserProps}
              {...this.props.browserProps.folderRendererProps}
            />
          )
        }
      }
      if (children.length) {
        children = (<ul style={{padding: '0 8px', paddingLeft: '16px'}}>{children}</ul>)
      } else {
        children = (<p>No items in this folder</p>)
      }
    }

    let folder = (
      <li
        className={ClassNames('folder', {
          expanded: (this.props.isOpen && this.props.browserProps.nestChildren),
          pending: (this.props.action),
          dragging: (this.props.isDragging),
          dragover: this.props.isOver,
          selected: this.props.isSelected,
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
    if (typeof this.props.browserProps.moveFolder === 'function' && this.props.keyDerived) {
      folder = this.props.connectDragPreview(folder)
    }

    return this.connectDND(folder)
  }
}

export default ListThumbnailFolder
