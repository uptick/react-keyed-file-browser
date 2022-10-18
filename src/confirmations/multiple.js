import React from 'react'
import PropTypes from 'prop-types'
import { getIntl } from '../browser'

const MultipleConfirmDeletion = (props) => {
  const {
    handleDeleteSubmit,
  } = props

  return (
    <button className="deleting" onClick={handleDeleteSubmit}>
      {getIntl('confirmations.delete')}
    </button>
  )
}

MultipleConfirmDeletion.propTypes = {
  handleDeleteSubmit: PropTypes.func,
}

export default MultipleConfirmDeletion
