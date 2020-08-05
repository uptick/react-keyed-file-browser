import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../i18n';

const MultipleConfirmDeletion = (props) => {
  const {
    handleDeleteSubmit,
  } = props
  const i18n = props.i18n? props.i18n : null

  return (
    <button className="deleting" onClick={handleDeleteSubmit}>
      {i18n? i18n.messages['confirm_deletion']: 'Confirm Deletion'}
    </button>
  )
}

MultipleConfirmDeletion.propTypes = {
  handleDeleteSubmit: PropTypes.func,
}

export default MultipleConfirmDeletion
