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

class ListFile extends BaseFile {
  render() {
    var icon;
    if (this.isImage()) {
      if (this.props.thumbnail_url) {
        icon = (
          <div className="image" style={{
            backgroundImage: 'url('+this.props.thumbnail_url+')',
          }}></div>
        );
      }
      else
        icon = (<i className="fa fa-file-image-o" aria-hidden="true"></i>);
    }
    else if (this.isPdf())
      icon = (<i className="fa fa-file-pdf-o" aria-hidden="true"></i>);
    else
      icon = (<i className="fa fa-file-o" aria-hidden="true"></i>);

    var inAction = (this.props.isDragging || this.props.action);

    var name;
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
            <input
              ref="newName"
              className="form-control input-sm"
              type="text"
              value={this.state.newName}
              onChange={this.handleNewNameChange}
            />
            <div className="actions">
              <a
                className="cancel btn btn-primary btn-sm"
                onClick={this.handleCancelEdit}
              >
                Cancel
              </a>
            </div>
          </form>
        );
      }
      else {
        name = (
          <a href={this.props.url} download="download" onClick={this.handleFileClick}>
            {this.getName()}
          </a>
        );
      }
    }

    var size;
    if (this.props.showSize) {
      if (!this.props.isRenaming && !this.props.isDeleting) {
        size = (
          <span className="size"><small>{ApiUtils.file_size(this.props.size)}</small></span>
        );
      }
    }
    var modified;
    if (this.props.showModified) {
      if (!this.props.isRenaming && !this.props.isDeleting) {
        modified = (
          <span className="modified text-muted">
            Last modified: {Moment(this.props.modified).fromNow()}
          </span>
        );
      }
    }

    var rowProps = {};
    if (this.props.isSelectable) {
      rowProps = {
        onClick: this.handleItemClick,
      };
    }

    var row = (
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
    );
    if (this.props.browserProps.canMoveFiles)
      row = this.props.connectDragPreview(row);

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

ListFile.defaultProps = {
  showName: true,
  showSize: true,
  showModified: true,
  isSelectable: true,
}

module.exports = DragSource('file', dragSource, dragCollect)(
  DropTarget(['file', 'folder', NativeTypes.FILE], targetSource, targetCollect)(
    ListFile
  )
);
