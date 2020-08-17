import React from 'react'
import PropTypes from 'prop-types'

const ConfirmDeletion = (props) => {
  const {
    children,
    handleDeleteSubmit,
    handleFileClick,
    url,
    messages,
  } = props

  return (
    <form className="deleting" onSubmit={handleDeleteSubmit}>
      <a
        href={url}
        download="download"
        onClick={handleFileClick}
      >
        {children}
      </a>
      <div>
        <button type="submit">
          {messages.confirm_deletion}
        </button>
      </div>
    </form>
  )
}

ConfirmDeletion.propTypes = {
  children: PropTypes.node,
  handleDeleteSubmit: PropTypes.func,
  handleFileClick: PropTypes.func,
  url: PropTypes.string,
  messages: PropTypes.object,
}

ConfirmDeletion.defaultProps = {
  url: '#',
}

export default ConfirmDeletion
