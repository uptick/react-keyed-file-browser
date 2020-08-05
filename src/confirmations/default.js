import React from 'react'
import PropTypes from 'prop-types';

const ConfirmDeletion = (props) => {
  const {
    children,
    handleDeleteSubmit,
    handleFileClick,
    url,
  } = props
  const i18n = props.i18n? props.i18n : null

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
          {i18n ? i18n.messages['confirm_deletion']: 'Confirm Deletion'}
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
}

ConfirmDeletion.defaultProps = {
  url: '#',
}

export default ConfirmDeletion
