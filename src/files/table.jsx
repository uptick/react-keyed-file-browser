import React from 'react'
import Moment from 'moment'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import {
  component as BaseFile,
  dragSource,
  dragCollect,
  targetSource,
  targetCollect,
} from './../base-file.jsx'

function file_size(size) {
  if (size > 1024) {
    var kb_size = size / 1024;
    if (kb_size > 1024) {
      var mb_size = kb_size / 1024;
      return '' + float_precision(mb_size, 2) + ' MB';
    }
    return '' + Math.round(kb_size) + ' kB';
  }
  return '' + size + ' B';
}

class TableFile extends BaseFile {
  render() {
    var icon;
    if (this.isImage())
      icon = (<i className="fa fa-file-image-o" aria-hidden="true"></i>);
    else if (this.isPdf())
      icon = (<i className="fa fa-file-pdf-o" aria-hidden="true"></i>);
    else
      icon = (<i className="fa fa-file-o" aria-hidden="true"></i>);

    var inAction = (this.props.isDragging || this.props.action);

    var name;
    if (!inAction && this.props.isDeleting) {
      name = (
        <form className="deleting" onSubmit={this.handleDeleteSubmit}>
          <a href={this.props.url} download="download" onClick={this.handleFileClick}>
            <span className="icon">{icon}</span>
            {this.getName()}
          </a>
          <div className="actions">
            <a
              className="cancel btn btn-primary btn-sm"
              onClick={this.handleCancelEdit}
            >
              Cancel
            </a>
            <button type="submit" className="btn btn-sm btn-secondary">
              Confirm Delete
            </button>
          </div>
        </form>
      );
    }
    else if (!inAction && this.props.isRenaming) {
      name = (
        <form className="renaming" onSubmit={this.handleRenameSubmit}>
          <span className="icon">{icon}</span>
          <input
            ref="newName"
            className="form-control input-sm"
            type="text"
            value={this.state.newName}
            onChange={this.handleNewNameChange}
          />
          <div className="actions">
            <a className="cancel btn btn-primary btn-sm" onClick={this.handleCancelEdit}>
              Cancel
            </a>
          </div>
        </form>
      );
    }
    else {
      name = (
        <a href={this.props.url} download="download" onClick={this.handleFileClick}>
          <span className="icon">{icon}</span>
          {this.getName()}
        </a>
      );
    }

    var draggable = (
      <div>
        {name}
      </div>
    );
    if (this.props.browserProps.canMoveFiles)
      draggable = this.props.connectDragPreview(draggable);

    var row = (
      <tr
        className={ClassNames('file', {
          pending: (this.props.action),
          dragging: (this.props.isDragging),
          dragover: (this.props.isOver),
          selected: (this.props.isSelected),
        })}
        onClick={this.handleItemClick}
        onDoubleClick={this.handleItemDoubleClick}
      >
        <td className="name" style={{paddingLeft: (this.props.depth * 16) + 'px'}}>
          {draggable}
        </td>
        <td className="text-xs-right">{file_size(this.props.size)}</td>
        <td className="text-xs-right">{Moment(this.props.modified).fromNow()}</td>
      </tr>
    );

    if (
      this.props.browserProps.canMoveFiles
      && !inAction
      && !this.props.isRenaming
    ) {
      row = this.props.connectDragSource(row);
    }
    if (
      this.props.browserProps.canCreateFiles
      || this.props.browserProps.canMoveFiles
      || this.props.browserProps.canMoveFolders
    ) {
      row = this.props.connectDropTarget(row);
    }
    return row;
  }
}

module.exports = DragSource('file', dragSource, dragCollect)(
  DropTarget(['file', 'folder', NativeTypes.FILE], targetSource, targetCollect)(
    TableFile
  )
);
