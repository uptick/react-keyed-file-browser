import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import flow from 'lodash/flow';

import BaseFile, { BaseFileConnectors } from './../base-file.js'

class RawTableFile extends BaseFile {

  render() {
    const {
      isDragging, isDeleting, isRenaming, isOver, isSelected,
      action, url, browserProps, connectDragPreview,
      depth, size, modified, isSensor
    } = this.props

    const icon = browserProps.icons[isSensor ? "Sensor" : this.getFileType()] ||
      browserProps.icons.File;
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
          {icon}
          {this.getName()}
        </ConfirmDeletionRenderer>
      )
    } else if (!inAction && isRenaming) {
      name = (
        <form className="renaming" onSubmit={this.handleRenameSubmit}>
          {icon}
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
        <a>
          {icon}
          {this.getName()}
        </a>
      )
    }

    let draggable = (
      <div className="nameLbl">
        {name}
      </div>
    )
    if (typeof browserProps.moveFile === 'function') {
      draggable = connectDragPreview(draggable)
    }

    const row = (
      <tr
        className={ClassNames('file', {
          pending: action,
          dragging: isDragging,
          dragover: isOver,
          selected: isSelected,
        })}
        onClick={this.handleItemClick}
        onDoubleClick={this.handleItemDoubleClick}
      >
        <td className="name">
          <div className="nameBox" style={{ paddingLeft: (depth * 16) + 'px' }}>
            {draggable}
            {isSensor && (
              <>
                <div className="rowBtn" onClick={() => {
                  window.open(`${window.location.origin}/test`, '_blank').focus();
                }}>
                  <i className="fa fa-chart-simple" aria-hidden="true" />
                  Analysis
                </div>
                <div className="rowBtn">
                  <i className="fa fa-list" aria-hidden="true" />
                  Data Log
                </div>
                <div className="device-settings">
                  <i className="fa fa-gear" aria-hidden="true" />
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
    )

    return this.connectDND(row)
  }
}

const TableFile = flow(
  DragSource('file', BaseFileConnectors.dragSource, BaseFileConnectors.dragCollect),
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawTableFile)

export default TableFile
export { RawTableFile }
