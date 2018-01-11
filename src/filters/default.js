import PropTypes from 'prop-types'
import React from 'react'

class Filter extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    // Additional incoming props that aren't used here but may be useful to custom Filter component:
    // clearFilter: PropTypes.func,
  }

  render() {
    return (
      <input
        ref="filter"
        type="search"
        placeholder="Filter files"
        value={this.props.value}
        onChange={this.props.onChange}
      />
    )
  }
}

export default Filter
