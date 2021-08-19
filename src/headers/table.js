import PropTypes from 'prop-types'
import React from 'react'
import ClassNames from 'classnames'

import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { BaseFileConnectors } from './../base-file.js'
import { withNamespaces } from 'react-i18next'
import { BROWSER_COLUMNS } from '../browser'

class RawTableHeader extends React.Component {
  static propTypes = {
    select: PropTypes.func,
    fileKey: PropTypes.string,
    columns: PropTypes.array,

    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool,
    isSelected: PropTypes.func,

    browserProps: PropTypes.shape({
      createFiles: PropTypes.func,
      moveFolder: PropTypes.func,
      moveFile: PropTypes.func,
    }),
  }

  handleHeaderClick(event) {
    this.props.select(this.props.fileKey)
  }

  render() {
    const { t } = this.props
    const header = (
      <tr
        className={ClassNames('folder', {
          dragover: this.props.isOver,
          selected: this.props.isSelected,
        })}
      >
        {this.props.columns?.includes(BROWSER_COLUMNS.FILE) ? <th>{t('file')}</th> : null}
        {this.props.columns?.includes(BROWSER_COLUMNS.SIZE) ? <th className="size">{t('size')}</th> : null}
        {this.props.columns?.includes(BROWSER_COLUMNS.LAST_MODIFIED) ? <th className="modified">{t('lastModified')}</th> : null}
      </tr>
    )

    if (
      typeof this.props.browserProps.createFiles === 'function' ||
      typeof this.props.browserProps.moveFile === 'function' ||
      typeof this.props.browserProps.moveFolder === 'function'
    ) {
      return this.props.connectDropTarget(header)
    } else {
      return header
    }
  }
}

@DropTarget(
  ['file', 'folder', NativeTypes.FILE],
  BaseFileConnectors.targetSource,
  BaseFileConnectors.targetCollect
)
class TableHeader extends RawTableHeader {}

export default withNamespaces()(TableHeader)
export { RawTableHeader }
