import React from 'react'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import {
  BaseFolder,
  dragSource,
  dragCollect,
} from './../base-folder.js'
import { targetSource, targetCollect } from './../base-file.js'

class TableFolder extends BaseFolder {
  render() {
    var icon;
    if (this.props.isOpen) {
      icon = (<i className="fa fa-folder-open-o" aria-hidden="true"></i>);
    }
    else {
      icon = (<i className="fa fa-folder-o" aria-hidden="true"></i>);
    }

    var inAction = (this.props.isDragging || this.props.action);

    var name;
    if (!inAction && this.props.isDeleting) {
      name = (
        <form className="deleting" onSubmit={this.handleDeleteSubmit}>
          <a
            href={this.props.url}
            download="download"
            onClick={(event) => {
              event.preventDefault();
              this.handleFileClick();
            }}
          >
            {icon}
            {this.getName()}
          </a>
          <div className="actions">
            <button type="submit" className="btn btn-sm btn-secondary">
              Confirm Deletion
            </button>
          </div>
        </form>
      );
    }
    else if ((!inAction && this.props.isRenaming) || this.props.isDraft) {
      name = (
        <div>
          <form className="renaming" onSubmit={this.handleRenameSubmit}>
            {icon}
            <input
              type="text"
              ref="newName"
              className="form-control input-sm"
              value={this.state.newName}
              onChange={this.handleNewNameChange}
              onBlur={this.handleCancelEdit}
              autoFocus={true}
            />
          </form>
        </div>
      );
    }
    else {
      name = (
        <div>
          <a onClick={this.toggleFolder}>
            {icon}
            {this.getName()}
          </a>
        </div>
      );
    }

    if (typeof this.props.browserProps.moveFolder === 'function') {
      name = this.props.connectDragPreview(name);
    }

    var folder = (
      <tr
        className={ClassNames('folder', {
          pending: (this.props.action),
          dragging: (this.props.isDragging),
          dragover: this.props.isOver,
          selected: this.props.isSelected,
        })}
        onClick={this.handleFolderClick}
        onDoubleClick={this.handleFolderDoubleClick}
      >
        <td className="name">
          <div style={{paddingLeft: (this.props.depth * 16) + 'px'}}>
            {name}
          </div>
        </td>
        <td></td>
        <td></td>
      </tr>
    );

    return this.connectDND(folder);
  }
}

export default DragSource('folder', dragSource, dragCollect)(
  DropTarget(['file', 'folder', NativeTypes.FILE], targetSource, targetCollect)(
    TableFolder
  )
)
