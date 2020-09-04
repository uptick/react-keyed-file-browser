import React from 'react'
import PropTypes from 'prop-types'

const MultipleConfirmDeletion = (props) => {
  const {
    handleDeleteSubmit,
    messages,
  } = props

  return (
    <button className="deleting" onClick={handleDeleteSubmit}>
      {messages.confirm_deletion}
    </button>
  )
}

MultipleConfirmDeletion.propTypes = {
  handleDeleteSubmit: PropTypes.func,
  messages: PropTypes.object,
}

export default MultipleConfirmDeletion
