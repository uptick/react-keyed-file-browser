import PropTypes from 'prop-types'
import React from 'react'

class Filter extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    updateFilter: PropTypes.func,
  }

  handleFilterChange = (event) => {
    const newValue = this.filterRef.value
    this.props.updateFilter(newValue)
  }

  render() {
    const i18n = this.props.i18n ? this.props.i18n : null;
    return (
      <input
        ref={el => { this.filterRef = el }}
        type="search"
        placeholder= {i18n ?i18n.messages['filter_files']: 'Filter files'}
        value={this.props.value}
        onChange={this.handleFilterChange}
      />
    )
  }
}

export default Filter
