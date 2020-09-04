import PropTypes from 'prop-types'
import React from 'react'

class Filter extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    updateFilter: PropTypes.func,
    messages: PropTypes.object,
  }

  handleFilterChange = (event) => {
    const newValue = event.target.value
    this.props.updateFilter(newValue)
  }

  render() {
    const { messages } = this.props
    return (
      <input
        type="search"
        placeholder={messages.filter_files}
        value={this.props.value}
        onChange={this.handleFilterChange}
      />
    )
  }
}

export default Filter
