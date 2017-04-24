import React from 'react'
import Moment from 'moment'
import ClassNames from 'classnames'
import { DragSource, DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import {
  BaseFile,
  dragSource,
  dragCollect,
  targetSource,
  targetCollect,
} from './../base-file.jsx'

function float_precision(float_value, precision) {
  float_value = parseFloat(float_value);
  if (isNaN(float_value)) {
    return parseFloat('0').toFixed(precision);
  }
  else {
    var power = Math.pow(10, precision);
    float_value = (Math.round(float_value * power) / power).toFixed(precision);
    return float_value.toString();
  }
}

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
    if (this.isImage()) {
      icon = (<i className="fa fa-file-image-o" aria-hidden="true"></i>);
    }
    else if (this.isPdf()) {
      icon = (<i className="fa fa-file-pdf-o" aria-hidden="true"></i>);
    }
    else {
      icon = (<i className="fa fa-file-o" aria-hidden="true"></i>);
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
    else if (!inAction && this.props.isRenaming) {
      name = (
        <form className="renaming" onSubmit={this.handleRenameSubmit}>
          {icon}
          <input
            ref="newName"
            className="form-control input-sm"
            type="text"
            value={this.state.newName}
            onChange={this.handleNewNameChange}
            onBlur={this.handleCancelEdit}
          />
        </form>
      );
    }
    else {
      name = (
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
      );
    }

    var draggable = (
      <div>
        {name}
      </div>
    );
    if (typeof this.props.browserProps.moveFile === 'function') {
      draggable = this.props.connectDragPreview(draggable);
    }

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
        <td className="name">
          <div style={{paddingLeft: (this.props.depth * 16) + 'px'}}>
            {draggable}
          </div>
        </td>
        <td className="size">{file_size(this.props.size)}</td>
        <td className="modified">
          {typeof this.props.modified === 'undefined' ? '-' : Moment(this.props.modified, 'x').fromNow()}
        </td>
      </tr>
    );

    if (
      typeof this.props.browserProps.moveFile === 'function'
      && !inAction
      && !this.props.isRenaming
    ) {
      row = this.props.connectDragSource(row);
    }
    if (
      typeof this.props.browserProps.createFile === 'function'
      || typeof this.props.browserProps.moveFile === 'function'
      || typeof this.props.browserProps.moveFolder === 'function'
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
