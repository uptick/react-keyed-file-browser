import React from 'react'
import ClassNames from 'classnames'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { targetSource, targetCollect } from './../base-file.jsx'

class TableHeader extends React.Component {
  handleHeaderClick(event) {
    this.props.select(this.props.fileKey);
  }

  render() {
    var header = (
      <tr
        className={ClassNames('folder', {
          dragover: this.props.isOver,
          selected: this.props.isSelected,
        })}
      >
        <th>File</th>
        <th className="size">Size</th>
        <th className="modified">Last Modified</th>
      </tr>
    );

    if (this.props.browserProps.canCreateFiles) {
      return this.props.connectDropTarget(
        header
      );
    }
    else {
      return header;
    }
  }
}

export default DropTarget(['file', 'folder', NativeTypes.FILE], targetSource, targetCollect)(
  TableHeader
);
