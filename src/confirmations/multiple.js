import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

const MultipleConfirmDeletion = (props) => {
  const { t } = props
  const {
    handleDeleteSubmit,
  } = props

  return (
    <button className="deleting" onClick={handleDeleteSubmit}>
      {t('confirmDeletion')}
    </button>
  )
}

MultipleConfirmDeletion.propTypes = {
  handleDeleteSubmit: PropTypes.func,
}

export default withNamespaces()(MultipleConfirmDeletion)
