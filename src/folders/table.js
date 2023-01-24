import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import flow from 'lodash/flow'

import BaseFolder, { BaseFolderConnectors } from './../base-folder.js'
import { BaseFileConnectors } from './../base-file.js'

class RawTableFolder extends BaseFolder {
  render() {
    const {
      isOpen, isDragging, isDeleting, isRenaming, isDraft, isOver, isSelected,
      action, url, browserProps, connectDragPreview, depth,

      // Gateway Data
      statusIcon,
      isGateway,

      gatewaySettings,
      name,
      id,
      password,
      description,
      location
    } = this.props

    const icon = browserProps.icons[isGateway ?
      'Gateway' :
      (isOpen ? 'FolderOpen' : 'Folder')]
    const inAction = (isDragging || action);

    const ConfirmDeletionRenderer = browserProps.confirmDeletionRenderer

    let nameLbl
    if (!inAction && isDeleting && browserProps.selection.length === 1) {
      nameLbl = (
        <ConfirmDeletionRenderer
          handleDeleteSubmit={this.handleDeleteSubmit}
          handleFileClick={this.handleFileClick}
          url={url}
        >
          {icon}
          {this.getName()}
        </ConfirmDeletionRenderer>
      )
    } else if ((!inAction && isRenaming) || isDraft) {
      nameLbl = (
        <div>
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            <span style={{ color: statusIcon }}>⬤</span>
            {icon}
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
      nameLbl = (
        <div>
          <a onClick={this.toggleFolder}>
            <span style={{ color: statusIcon }}>⬤</span>
            {icon}
            {this.getName()}
          </a>
        </div>
      )
    }

    let draggable = (
      <div className="nameLbl">
        {nameLbl}
      </div>
    )
    if (typeof browserProps.moveFile === 'function') {
      draggable = connectDragPreview(draggable)
    }

    const folder = (
      <tr
        className={ClassNames('folder', {
          pending: action,
          dragging: isDragging,
          dragover: isOver,
          selected: isSelected,
        })}
        onClick={this.handleFolderClick}
        onDoubleClick={this.handleFolderDoubleClick}
      >
        <td className="name">
          <div className="nameBox" style={{ paddingLeft: (depth * 16) + 'px' }}>
            {draggable}
            {isGateway && (
              <>
                <div className="device-settings" onClick={() => {
                  gatewaySettings({
                    name: name,
                    id: id,
                    password: password,
                    description: description,
                    location: location
                  });
                }}>
                  <i className="fa fa-gear" aria-hidden="true" />
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
    )

    return this.connectDND(folder)
  }
}

const TableFolder = flow(
  DragSource('folder', BaseFolderConnectors.dragSource, BaseFolderConnectors.dragCollect),
  DropTarget(['file', 'folder', NativeTypes.FILE], BaseFileConnectors.targetSource, BaseFileConnectors.targetCollect)
)(RawTableFolder)

export default TableFolder
export { RawTableFolder }
