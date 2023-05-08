import PropTypes from 'prop-types'
import React from 'react'

export class DefaultActionBar extends React.Component {
  static propTypes = {
    filter: PropTypes.element,
    actions: PropTypes.element,
  }

  render() {
    const { filter, actions } = this.props

    return (
      <div className="action-bar">
        {filter}
        {actions}
      </div>
    )
  }
}
