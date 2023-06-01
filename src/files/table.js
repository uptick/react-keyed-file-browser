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
      depth, size, modified,
      analysisFunc, dataLogFunc,

      // Sensor Settings
      customType,
      statusIcon,
      sensorSettings
    } = this.props

    const icon = browserProps.icons[(customType === 'sensor') ? "Sensor" : ((customType === 'sample') ? 'Sample' : this.getFileType())] ||
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
          <span style={{ color: statusIcon }}>⬤</span>
          {icon}
          {this.getName()}
        </ConfirmDeletionRenderer>
      )
    } else if (!inAction && isRenaming) {
      name = (
        <form className="renaming" onSubmit={this.handleRenameSubmit}>
          <span style={{ color: statusIcon }}>⬤</span>
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
          <span style={{ color: statusIcon }}>⬤</span>
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
            {(customType === 'sensor' || customType === 'sample') && (
              <>
                {analysisFunc && 
                  <div className="rowBtn" onClick={() => {
                    analysisFunc();
                  }}>
                    <i className="fa fa-chart-simple" aria-hidden="true" />
                    {(window.innerWidth > 550) && (<>
                      Analysis
                    </>)}
                  </div>
                }
                {dataLogFunc && 
                  <div className="rowBtn" onClick={() => {
                    dataLogFunc();
                  }}>
                    <i className="fa fa-list" aria-hidden="true" />
                    {(window.innerWidth > 550) && (<>
                      Data Log
                    </>)}
                  </div>
                }
                {customType === 'sensor' && 
                  <div className="device-settings" onClick={() => {
                    sensorSettings(this.getName());
                  }}>
                    <i className="fa fa-gear" aria-hidden="true" />
                  </div>
                }
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
