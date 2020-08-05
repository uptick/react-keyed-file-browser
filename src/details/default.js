import PropTypes from 'prop-types'
import React from 'react'

class Detail extends React.Component {
  static propTypes = {
    file: PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      extension: PropTypes.string.isRequired,
      url: PropTypes.string,
    }).isRequired,
    close: PropTypes.func,
  }

  handleCloseClick = (event) => {
    if (event) {
      event.preventDefault()
    }
    this.props.close()
  }

  render() {
    let name = this.props.file.key.split('/')
    name = name.length ? name[name.length - 1] : ''
    const i18n = this.props.i18n ? this.props.i18n: null

    return (
      <div>
        <h2>{i18n? i18n.messages['item_details']: 'Item details'}</h2>
        <dl>
          <dt>{i18n? i18n.messages['key'] : 'key'}</dt>
          <dd>{this.props.file.key}</dd>

          <dt>{i18n? i18n.messages['name'] : 'name'}</dt>
          <dd>{name}</dd>
        </dl>
        <a href="#" onClick={this.handleCloseClick}>{i18n ? i18n.messages['close']: 'Close'}</a>
      </div>
    )
  }
}

export default Detail
