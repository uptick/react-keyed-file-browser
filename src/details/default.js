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
    messages: PropTypes.object,
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
    const { messages } = this.props

    return (
      <div>
        <h2>{messages.item_details}</h2>
        <dl>
          <dt>{messages.key}</dt>
          <dd>{this.props.file.key}</dd>

          <dt>{messages.name}</dt>
          <dd>{name}</dd>
        </dl>
        <a href="#" onClick={this.handleCloseClick}>{messages.close}</a>
      </div>
    )
  }
}

export default Detail
